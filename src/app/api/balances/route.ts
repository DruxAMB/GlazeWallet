import { NextRequest, NextResponse } from "next/server";
import { getWalletBalances } from "@/lib/cdp";
import { resolveWalletAddress } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: "Missing required field: username" },
        { status: 400 }
      );
    }

    const senderAddress = await resolveWalletAddress(username);
    if (!senderAddress) {
      return NextResponse.json(
        { error: `No wallet found for @${username}` },
        { status: 404 }
      );
    }

    const balances = await getWalletBalances(username);
    return NextResponse.json(balances);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
