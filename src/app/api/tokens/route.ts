import { NextResponse } from "next/server";
import { CURATED_BASE_TOKENS, DEFAULT_FROM, DEFAULT_TO } from "@/lib/base-tokens";
import { resolveTradableAddress } from "@/lib/base-client";
import { getTokensData } from "@/lib/geckoterminal";

export async function GET() {
  try {
    const lookup = [...new Set(CURATED_BASE_TOKENS.map((t) => resolveTradableAddress(t.address).toLowerCase()))];
    let liveByAddr = new Map<string, { imageUrl: string | null; priceUsd: number | null; change24h: number | null }>();
    try {
      const data = await getTokensData(lookup);
      liveByAddr = new Map(
        data.map((t) => [t.address, { imageUrl: t.imageUrl, priceUsd: t.priceUsd, change24h: t.change24h }]),
      );
    } catch {
      // non-fatal
    }

    const tokens = CURATED_BASE_TOKENS.map((t) => {
      const live = liveByAddr.get(resolveTradableAddress(t.address).toLowerCase());
      return {
        address: t.address,
        symbol: t.symbol,
        name: t.name,
        decimals: t.decimals,
        isNative: t.isNative,
        logoURI: live?.imageUrl ?? null,
        priceUsd: live?.priceUsd ?? null,
        change24h: live?.change24h ?? null,
      };
    });

    return NextResponse.json({ tokens, defaults: { from: DEFAULT_FROM, to: DEFAULT_TO } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
