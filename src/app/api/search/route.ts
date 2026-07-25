import { NextRequest, NextResponse } from "next/server";
import { searchTokens } from "@/lib/geckoterminal";
import { getRedis, hasRegistry } from "@/lib/redis";

const TTL = 80;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Missing required field: query" },
        { status: 400 }
      );
    }

    const normalized = query.trim().toLowerCase();
    const cacheKey = `cache:cg:search:${normalized}`;

    if (hasRegistry()) {
      const cached = await getRedis().get<unknown>(cacheKey);
      if (cached) {
        return NextResponse.json(cached);
      }
    }

    const results = await searchTokens(query);

    if (hasRegistry()) {
      await getRedis().set(cacheKey, results, { ex: TTL });
    }

    return NextResponse.json(results);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
