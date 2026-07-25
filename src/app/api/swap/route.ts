import { NextRequest, NextResponse } from "next/server";
import { getAccountForUsername } from "@/lib/cdp";
import { resolveWalletAddress } from "@/lib/redis";

const NATIVE_ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
const CDP_NATIVE_ETH_SENTINEL = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, fromToken, toToken, amount, decimals, slippageBps } = body;

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

    const account = await getAccountForUsername(username);

    const isNativeFrom = fromToken.toLowerCase() === NATIVE_ETH_ADDRESS;
    const resolvedFromToken = isNativeFrom ? CDP_NATIVE_ETH_SENTINEL : fromToken;
    const resolvedToToken =
      toToken.toLowerCase() === NATIVE_ETH_ADDRESS ? CDP_NATIVE_ETH_SENTINEL : toToken;

    const fromDecimals = typeof decimals === "number" ? decimals : 18;
    const fromAmount = BigInt(Math.floor(Number(amount) * 10 ** fromDecimals));

    if (fromAmount <= 0n) {
      return NextResponse.json(
        { error: "Amount must be greater than zero" },
        { status: 400 }
      );
    }

    const swapResult = await account.swap({
      network: "base",
      fromToken: resolvedFromToken as `0x${string}`,
      toToken: resolvedToToken as `0x${string}`,
      fromAmount,
      slippageBps: typeof slippageBps === "number" ? slippageBps : undefined,
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
