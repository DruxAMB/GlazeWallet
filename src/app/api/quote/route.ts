import { NextRequest, NextResponse } from "next/server";
import { getQuote, type QuoteParams } from "@/lib/uniswap-quoter";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenInAddress, tokenInDecimals, tokenInSymbol, tokenOutAddress, tokenOutDecimals, tokenOutSymbol, amountIn, slippageBps } = body;

    if (!tokenInAddress || !tokenOutAddress || !amountIn) {
      return NextResponse.json(
        { error: "Missing required fields: tokenInAddress, tokenOutAddress, amountIn" },
        { status: 400 }
      );
    }

    const params: QuoteParams = {
      tokenInAddress,
      tokenInDecimals: typeof tokenInDecimals === "number" ? tokenInDecimals : 18,
      tokenInSymbol: tokenInSymbol ?? "?",
      tokenOutAddress,
      tokenOutDecimals: typeof tokenOutDecimals === "number" ? tokenOutDecimals : 18,
      tokenOutSymbol: tokenOutSymbol ?? "?",
      amountIn,
      slippageBps: typeof slippageBps === "number" ? slippageBps : undefined,
    };

    const result = await getQuote(params);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
