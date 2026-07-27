import { NextRequest, NextResponse } from "next/server";
import { estimateSendFee } from "@/lib/cdp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Missing required field: "token"' },
        { status: 400 }
      );
    }

    const isEth = token === "eth";
    const isUsd = token === "usdc";
    const isAddress = /^0x[a-fA-F0-9]{40}$/.test(token);
    if (!isEth && !isUsd && !isAddress) {
      return NextResponse.json(
        { error: 'Invalid "token": expected "eth", "usdc", or a 0x contract address' },
        { status: 400 }
      );
    }

    const result = await estimateSendFee(token);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
