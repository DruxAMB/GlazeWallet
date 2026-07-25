import { NextRequest, NextResponse } from "next/server";
import { getTokensData } from "@/lib/geckoterminal";
import { resolveTradableAddress } from "@/lib/base-client";
import { getRedis, hasRegistry } from "@/lib/redis";

const TTL = 80;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { addresses } = body;

    if (!Array.isArray(addresses)) {
      return NextResponse.json(
        { error: 'Invalid "addresses": expected string[]' },
        { status: 400 }
      );
    }

    const resolved = addresses.map((a: string) => resolveTradableAddress(a));
    const sorted = [...new Set(resolved.map((a: string) => a.toLowerCase()))].sort();
    const cacheKey = `cache:cg:prices:${sorted.join(",")}`;

    if (hasRegistry()) {
      const cached = await getRedis().get<unknown>(cacheKey);
      if (cached) {
        return NextResponse.json(cached);
      }
    }

    const data = await getTokensData(resolved);
    const payload = data.map((t) => ({
      address: t.address,
      symbol: t.symbol,
      name: t.name,
      decimals: t.decimals,
      logoURI: t.imageUrl,
      priceUsd: t.priceUsd,
      change24h: t.change24h,
    }));

    if (hasRegistry()) {
      await getRedis().set(cacheKey, payload, { ex: TTL });
    }

    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
