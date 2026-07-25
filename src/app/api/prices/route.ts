import { NextRequest, NextResponse } from "next/server";
import { getTokensData } from "@/lib/geckoterminal";
import { resolveTradableAddress } from "@/lib/base-client";

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
    const data = await getTokensData(resolved);
    return NextResponse.json(
      data.map((t) => ({
        address: t.address,
        symbol: t.symbol,
        name: t.name,
        decimals: t.decimals,
        logoURI: t.imageUrl,
        priceUsd: t.priceUsd,
        change24h: t.change24h,
      })),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
