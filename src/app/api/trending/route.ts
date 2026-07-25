import { NextResponse } from "next/server";
import { getTrending } from "@/lib/geckoterminal";
import { getRedis, hasRegistry } from "@/lib/redis";

const CACHE_KEY = "cache:cg:trending";
const TTL = 80;

export async function GET() {
  try {
    if (hasRegistry()) {
      const cached = await getRedis().get<unknown>(CACHE_KEY);
      if (cached) {
        return NextResponse.json(cached);
      }
    }

    const trending = await getTrending();

    if (hasRegistry()) {
      await getRedis().set(CACHE_KEY, trending, { ex: TTL });
    }

    return NextResponse.json(trending);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
