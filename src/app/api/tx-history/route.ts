import { NextRequest, NextResponse } from "next/server";
import { getTransactionHistory } from "@/lib/tx-history";
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

    const address = await resolveWalletAddress(username);
    if (!address) {
      return NextResponse.json(
        { error: `No wallet found for @${username}` },
        { status: 404 }
      );
    }

    const history = await getTransactionHistory(address);
    return NextResponse.json(history);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
