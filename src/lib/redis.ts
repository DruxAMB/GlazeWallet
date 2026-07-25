import { Redis } from "@upstash/redis";

export interface RegistryProfile {
  walletAddress: string;
  avatarData: string;
  passcodeHash: string;
}

export interface UsernameAvailability {
  available: boolean;
  reason?: string;
}

const NAME_RE = /^[a-z0-9_]{3,20}$/;
const RULE = "3-20 characters: lowercase letters, numbers, or underscore.";

const userKey = (name: string) => `glazewallet:username:${name}`;
const addrKey = (addr: string) => `glazewallet:addr:${addr.toLowerCase()}`;
const CATALOG_COUNT_KEY = "glazewallet:avatars:count";
const catalogItemKey = (i: number) => `glazewallet:avatars:item:${i}`;

let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (_redis) return _redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error("Missing Upstash Redis environment variables");
  }

  _redis = new Redis({ url, token });

  return _redis;
}

export function hasRegistry(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

export function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidUsername(name: string): boolean {
  return NAME_RE.test(name);
}

function toRecord(raw: unknown): RegistryProfile | null {
  if (typeof raw === "string" && raw.length > 0) {
    return { walletAddress: raw, avatarData: "", passcodeHash: "" };
  }
  if (raw && typeof (raw as RegistryProfile).walletAddress === "string") {
    const r = raw as RegistryProfile;
    return { walletAddress: r.walletAddress, avatarData: r.avatarData ?? "", passcodeHash: r.passcodeHash ?? "" };
  }
  return null;
}

/** Full profile record registered to a username, or null. */
export async function lookupProfile(rawName: string): Promise<RegistryProfile | null> {
  const name = normalizeUsername(rawName);
  if (!isValidUsername(name)) return null;
  return toRecord(await getRedis().get<unknown>(userKey(name)));
}

/** Address currently registered to a username, or null. */
export async function resolveWalletAddress(username: string): Promise<string | null> {
  const rec = await lookupProfile(username);
  return rec?.walletAddress ?? null;
}

/** Username registered for an address, or null. */
export async function usernameForAddress(address: string): Promise<string | null> {
  const name = await getRedis().get<string>(addrKey(address));
  return name ?? null;
}

/** Whether a username can be claimed (optionally by a specific address). */
export async function checkUsername(rawName: string, address?: string): Promise<UsernameAvailability> {
  const name = normalizeUsername(rawName);
  if (!isValidUsername(name)) return { available: false, reason: RULE };
  const owner = await resolveWalletAddress(name);
  if (owner && (!address || owner.toLowerCase() !== address.toLowerCase())) {
    return { available: false, reason: "That username is already taken." };
  }
  return { available: true };
}

/** Claim a username for a full profile record (idempotent for the same address). */
export async function registerUsername(rawName: string, record: RegistryProfile): Promise<RegistryProfile> {
  const name = normalizeUsername(rawName);
  if (!isValidUsername(name)) throw new Error(`Choose a valid username - ${RULE}`);
  const address = record.walletAddress;
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) throw new Error("Invalid wallet address.");

  const client = getRedis();
  const existing = toRecord(await client.get<unknown>(userKey(name)));
  if (existing && existing.walletAddress.toLowerCase() !== address.toLowerCase()) {
    throw new Error("That username is already taken.");
  }

  const prev = await client.get<string>(addrKey(address));
  if (prev && prev !== name) await client.del(userKey(prev));

  await client.set(userKey(name), record);
  await client.set(addrKey(address), name);
  return record;
}

/** Update the stored passcode hash for an existing username (best-effort). */
export async function updateRegistryPasscode(rawName: string, passcodeHash: string): Promise<void> {
  const name = normalizeUsername(rawName);
  const rec = await lookupProfile(name);
  if (!rec) return;
  await getRedis().set(userKey(name), { ...rec, passcodeHash });
}

/** All avatars in the shared catalog (data URLs), or [] if none/unconfigured. */
export async function getAvatarCatalog(): Promise<string[]> {
  if (!hasRegistry()) return [];
  const client = getRedis();
  const count = (await client.get<number>(CATALOG_COUNT_KEY)) ?? 0;
  if (count <= 0) return [];
  const keys = Array.from({ length: count }, (_, i) => catalogItemKey(i));
  const items = await client.mget<string[]>(...keys);
  return (items ?? []).filter((v): v is string => typeof v === "string" && v.length > 0);
}
