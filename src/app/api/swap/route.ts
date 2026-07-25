import { NextRequest, NextResponse } from "next/server";
import { getCdpClient } from "@/lib/cdp";
import { resolveWalletAddress } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, fromToken, toToken, amount, network } = body;

    if (!username || !fromToken || !toToken || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: username, fromToken, toToken, amount" },
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

    const client = getCdpClient();

    const account = await client.evm.getAccount({
      address: senderAddress as `0x${string}`,
    });

    const swapResult = await account.swap({
      network: network ?? "base",
      fromToken,
      toToken,
      fromAmount: BigInt(amount),
    });

    return NextResponse.json({
      success: true,
      transactionHash: swapResult.transactionHash,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
