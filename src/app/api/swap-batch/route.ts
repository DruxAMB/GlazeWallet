import { NextRequest, NextResponse } from "next/server";
import { encodeFunctionData, getAddress, parseAbi, parseEther, formatUnits } from "viem";
import { getCdpClient, getAccountForUsername, accountNameForUsername } from "@/lib/cdp";
import { resolveWalletAddress } from "@/lib/redis";
import { NATIVE_ETH_ADDRESS, getPublicClient } from "@/lib/base-client";

const FEE_BPS = 130; // 1.3% = 130 basis points
const FEE_RECIPIENT = "0xFB65078E65d9e2c9349A74941C9FABd019ceAc0e" as const;
const CDP_NATIVE_ETH_SENTINEL = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" as const;
const GAS_FUND_AMOUNT = parseEther("0.00008"); // ETH sent to smart account for gas

const ERC20_ABI = parseAbi([
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
]);

export async function POST(request: NextRequest) {
  let debugInfo: Record<string, unknown> = {};
  try {
    const body = await request.json();
    const { username, smartAccountAddress, fromToken, toToken, amount, decimals, slippageBps } = body;

    if (!username || !fromToken || !toToken || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: username, fromToken, toToken, amount" },
        { status: 400 },
      );
    }

    const senderAddress = await resolveWalletAddress(username);
    if (!senderAddress) {
      return NextResponse.json(
        { error: `No wallet found for @${username}` },
        { status: 404 },
      );
    }

    const fromDecimals = typeof decimals === "number" ? decimals : 18;
    const totalInput = BigInt(Math.floor(Number(amount) * 10 ** fromDecimals));

    if (totalInput <= 0n) {
      return NextResponse.json(
        { error: "Amount must be greater than zero" },
        { status: 400 },
      );
    }

    const isNativeFrom = fromToken.toLowerCase() === NATIVE_ETH_ADDRESS;
    const resolvedFromToken = isNativeFrom ? CDP_NATIVE_ETH_SENTINEL : fromToken;
    const resolvedToToken =
      toToken.toLowerCase() === NATIVE_ETH_ADDRESS ? CDP_NATIVE_ETH_SENTINEL : toToken;

    // 1.3% fee calculation
    const feeAmount = (totalInput * BigInt(FEE_BPS)) / 10_000n;
    const netSwapAmount = totalInput - feeAmount;

    if (netSwapAmount <= 0n) {
      return NextResponse.json(
        { error: "Net swap amount after fee is zero" },
        { status: 400 },
      );
    }

    // Get server account (owner) and smart account
    const cdp = getCdpClient();
    const owner = await getAccountForUsername(username);
    debugInfo.serverAccount = owner.address;

    let smartAccount;
    if (smartAccountAddress) {
      smartAccount = await cdp.evm.getSmartAccount({
        address: smartAccountAddress as `0x${string}`,
        owner,
      });
    } else {
      smartAccount = await cdp.evm.getOrCreateSmartAccount({
        name: accountNameForUsername(username),
        owner,
      });
    }
    debugInfo.smartAccount = smartAccount.address;

    const smartAddr = smartAccount.address;

    // Check server account has enough ETH for pre-funding + gas
    const publicClient = getPublicClient();
    const serverBalance = await publicClient.getBalance({ address: owner.address as `0x${string}` });
    const requiredEth = isNativeFrom ? totalInput + GAS_FUND_AMOUNT : GAS_FUND_AMOUNT;
    if (serverBalance < requiredEth) {
      return NextResponse.json(
        {
          error: `Insufficient ETH for gas funding. Server account has ${formatUnits(serverBalance, 18)} ETH but needs ${formatUnits(requiredEth, 18)} ETH.`,
          debug: debugInfo,
        },
        { status: 400 },
      );
    }

    // Pre-fund smart account: transfer input tokens + ETH for gas from server account
    if (!isNativeFrom) {
      // Transfer ERC20 tokens from server account to smart account
      const tokenTransferResult = await owner.transfer({
        to: smartAddr,
        token: fromToken as `0x${string}`,
        amount: totalInput,
        network: "base",
      });
      debugInfo.tokenTransferHash =
        "transactionHash" in tokenTransferResult ? tokenTransferResult.transactionHash : null;

      // Transfer ETH for gas
      const gasTransferResult = await owner.transfer({
        to: smartAddr,
        token: "eth",
        amount: GAS_FUND_AMOUNT,
        network: "base",
      });
      debugInfo.gasTransferHash =
        "transactionHash" in gasTransferResult ? gasTransferResult.transactionHash : null;
    } else {
      // For native ETH, transfer total + gas fund in one transaction
      const nativeTransferResult = await owner.transfer({
        to: smartAddr,
        token: "eth",
        amount: totalInput + GAS_FUND_AMOUNT,
        network: "base",
      });
      debugInfo.nativeTransferHash =
        "transactionHash" in nativeTransferResult ? nativeTransferResult.transactionHash : null;
    }

    // Create swap quote for the net amount (smart account is the taker)
    const swapQuote = await cdp.evm.createSwapQuote({
      network: "base",
      fromToken: resolvedFromToken as `0x${string}`,
      toToken: resolvedToToken as `0x${string}`,
      fromAmount: netSwapAmount,
      taker: smartAddr as `0x${string}`,
      signerAddress: owner.address as `0x${string}`,
      smartAccount,
      slippageBps: typeof slippageBps === "number" ? slippageBps : undefined,
    });

    if (!("liquidityAvailable" in swapQuote) || !swapQuote.liquidityAvailable) {
      return NextResponse.json(
        { error: "No liquidity available for this swap", debug: debugInfo },
        { status: 400 },
      );
    }

    if (!swapQuote.transaction) {
      return NextResponse.json(
        { error: "Swap quote has no executable transaction data", debug: debugInfo },
        { status: 400 },
      );
    }

    debugInfo.toAmount = swapQuote.toAmount.toString();
    const hasPermit2 = Boolean(swapQuote.permit2);
    debugInfo.hasPermit2 = hasPermit2;

    const scopedSmartAccount = await smartAccount.useNetwork("base");

    const isNativeTo = toToken.toLowerCase() === NATIVE_ETH_ADDRESS;
    const toAmount = swapQuote.toAmount;

    // Build fee transfer call
    let feeCall: { to: `0x${string}`; data: `0x${string}`; value: bigint };
    if (isNativeFrom) {
      feeCall = {
        to: FEE_RECIPIENT as `0x${string}`,
        data: "0x" as `0x${string}`,
        value: feeAmount,
      };
    } else {
      const tokenAddress = getAddress(fromToken);
      feeCall = {
        to: tokenAddress,
        data: encodeFunctionData({
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [FEE_RECIPIENT as `0x${string}`, feeAmount],
        }),
        value: 0n,
      };
    }

    // Build post-swap call: transfer output tokens from smart account back to server account
    let sweepCall: { to: `0x${string}`; data: `0x${string}`; value: bigint };
    if (isNativeTo) {
      sweepCall = {
        to: owner.address as `0x${string}`,
        data: "0x" as `0x${string}`,
        value: toAmount,
      };
    } else {
      const outputToken = getAddress(toToken);
      sweepCall = {
        to: outputToken,
        data: encodeFunctionData({
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [owner.address as `0x${string}`, toAmount],
        }),
        value: 0n,
      };
    }

    let swapTxHash: string | null = null;
    let swapUserOpHash: string | null = null;
    let feeTxHash: string | null = null;
    let batched: boolean;

    if (!hasPermit2) {
      // No Permit2: batch approve + swap + fee + sweep into a single UserOperation
      const swapCall = {
        to: swapQuote.transaction.to,
        data: swapQuote.transaction.data,
        value: swapQuote.transaction.value,
      };

      const calls: Array<{ to: `0x${string}`; data: `0x${string}`; value: bigint }> = [];

      if (!isNativeFrom) {
        const tokenAddress = getAddress(fromToken);
        calls.push({
          to: tokenAddress,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "approve",
            args: [swapQuote.transaction.to, netSwapAmount],
          }),
          value: 0n,
        });
      }

      calls.push(swapCall);
      calls.push(feeCall);
      calls.push(sweepCall);

      debugInfo.batchedCalls = calls.length;

      const userOpResult = await scopedSmartAccount.sendUserOperation({
        calls: calls as never,
      });
      swapUserOpHash = userOpResult.userOpHash;

      const completed = await scopedSmartAccount.waitForUserOperation({
        userOpHash: userOpResult.userOpHash,
      });

      if (completed.status === "failed") {
        return NextResponse.json(
          { error: "Batched UserOperation failed", userOpHash: completed.userOpHash, debug: debugInfo },
          { status: 500 },
        );
      }

      swapTxHash = completed.transactionHash;
      feeTxHash = completed.transactionHash;
      batched = true;
    } else {
      // Permit2: swap must be executed via swapQuote.execute() for signature handling
      // Fee + sweep sent as a separate UserOperation
      const swapResult = await swapQuote.execute();
      swapUserOpHash = swapResult.userOpHash ?? null;
      swapTxHash = swapResult.transactionHash ?? null;

      const feeResult = await scopedSmartAccount.sendUserOperation({
        calls: [feeCall, sweepCall] as never,
      });

      const feeCompleted = await scopedSmartAccount.waitForUserOperation({
        userOpHash: feeResult.userOpHash,
      });

      if (feeCompleted.status === "failed") {
        return NextResponse.json(
          { error: "Fee transfer UserOperation failed", userOpHash: feeCompleted.userOpHash, debug: debugInfo },
          { status: 500 },
        );
      }

      feeTxHash = feeCompleted.transactionHash;
      batched = false;
    }

    return NextResponse.json({
      success: true,
      transactionHash: swapTxHash,
      feeTransactionHash: feeTxHash,
      swapUserOpHash,
      smartAccountAddress: smartAddr,
      feeAmount: feeAmount.toString(),
      netSwapAmount: netSwapAmount.toString(),
      toAmount: swapQuote.toAmount.toString(),
      batched,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    // Map common CDP SDK errors to user-friendly messages
    let userMessage = message;
    if (message.includes("insufficient funds") || message.includes("insufficient balance")) {
      userMessage = "Insufficient ETH balance to cover gas fees. Please fund your wallet and try again.";
    } else if (message.includes("allowance") || message.includes("Permit2")) {
      userMessage = "Token approval required. Please try again or contact support.";
    } else if (message.includes("liquidity")) {
      userMessage = "No liquidity available for this token pair. Try a different amount or pair.";
    } else if (message.includes("execution reverted") || message.includes("revert")) {
      userMessage = "Transaction reverted on-chain. This may be due to slippage or insufficient liquidity. Try increasing slippage tolerance.";
    } else if (message.includes("timeout") || message.includes("timed out")) {
      userMessage = "Transaction timed out. Please try again.";
    }
    return NextResponse.json({ error: userMessage, debug: debugInfo }, { status: 500 });
  }
}
