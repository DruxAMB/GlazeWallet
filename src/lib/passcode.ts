import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

const ITERATIONS = 120_000;
const KEYLEN = 32;
const DIGEST = "sha256";

export const PASSCODE_RE = /^\d{6}$/;

export function isValidPasscode(code: string): boolean {
  return PASSCODE_RE.test(code);
}

export function hashPasscode(code: string): string {
  if (!isValidPasscode(code)) throw new Error("Passcode must be exactly 6 digits.");
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(code, salt, ITERATIONS, KEYLEN, DIGEST).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPasscode(code: string, stored: string): boolean {
  if (!stored || !isValidPasscode(code)) return false;
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = pbkdf2Sync(code, salt, ITERATIONS, KEYLEN, DIGEST).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(candidate, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
