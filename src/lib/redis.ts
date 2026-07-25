import { Redis } from "@upstash/redis";

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

export async function resolveWalletAddress(username: string): Promise<string | null> {
  const redis = getRedis();
  const address = await redis.get<string>(`user:${username}:address`);
  return address ?? null;
}
