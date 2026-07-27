import { NextRequest, NextResponse } from "next/server";
import { getAccountForUsername } from "@/lib/cdp";
import { resolveWalletAddress } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, toAddress, token, amount, decimals } = body;

    if (!username || !toAddress || !token || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: username, toAddress, token, amount" },
        { status: 400 }
      );
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(toAddress)) {
      return NextResponse.json(
        { error: "Invalid recipient address" },
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

    const account = await getAccountForUsername(username);

    const tokenDecimals =
      typeof decimals === "number"
        ? decimals
        : token === "eth"
          ? 18
          : token === "usdc"
            ? 6
            : 18;
    const atomicAmount = BigInt(Math.floor(Number(amount) * 10 ** tokenDecimals));

    if (atomicAmount <= 0n) {
      return NextResponse.json(
        { error: "Amount must be greater than zero" },
        { status: 400 }
      );
    }

    const transferToken =
      token === "eth"
        ? ("eth" as const)
        : token === "usdc"
          ? ("usdc" as const)
          : (token as `0x${string}`);

    const transferResult = await account.transfer({
      to: toAddress as `0x${string}`,
      token: transferToken,
      amount: atomicAmount,
      network: "base",
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
