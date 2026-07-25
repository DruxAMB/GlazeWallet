import { NextRequest, NextResponse } from "next/server";
import { estimateSendFee } from "@/lib/cdp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token || (token !== "eth" && token !== "usdc")) {
      return NextResponse.json(
        { error: 'Invalid or missing "token": expected "eth" or "usdc"' },
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
