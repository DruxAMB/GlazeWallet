import { NextRequest, NextResponse } from "next/server";
import { getCdpClient } from "@/lib/cdp";
import { resolveWalletAddress } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, toAddress, token, amount, network } = body;

    if (!username || !toAddress || !token || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: username, toAddress, token, amount" },
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

    const transferResult = await account.transfer({
      to: toAddress as `0x${string}`,
      token: token as "eth" | "usdc" | `0x${string}`,
      amount: BigInt(amount),
      network: network ?? "base",
    });

    const transactionHash =
      "transactionHash" in transferResult
        ? transferResult.transactionHash
        : null;

    return NextResponse.json({
      success: true,
      transactionHash,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
