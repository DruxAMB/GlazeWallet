import { encodePacked, formatUnits, getAddress, parseUnits } from "viem";

import { publicClient, BASE_ADDRESSES, resolveTradableAddress } from "./base-client";
import { getTokensData } from "./geckoterminal";

const QUOTER_ABI = [
  {
    type: "function",
    name: "quoteExactInputSingle",
    stateMutability: "view",
    inputs: [
      {
        type: "tuple",
        name: "params",
        components: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "amountIn", type: "uint256" },
          { name: "fee", type: "uint24" },
          { name: "sqrtPriceLimitX96", type: "uint160" },
        ],
      },
    ],
    outputs: [
      { name: "amountOut", type: "uint256" },
      { name: "sqrtPriceX96After", type: "uint160" },
      { name: "initializedTicksCrossed", type: "uint32" },
      { name: "gasEstimate", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "quoteExactInput",
    stateMutability: "view",
    inputs: [
      { name: "path", type: "bytes" },
      { name: "amountIn", type: "uint256" },
    ],
    outputs: [
      { name: "amountOut", type: "uint256" },
      { name: "sqrtPriceX96AfterList", type: "uint160[]" },
      { name: "initializedTicksCrossedList", type: "uint32[]" },
      { name: "gasEstimate", type: "uint256" },
    ],
  },
] as const;

const QUOTER = getAddress(BASE_ADDRESSES.QUOTER_V2);
const WETH = getAddress(BASE_ADDRESSES.WETH);
const USDC = getAddress(BASE_ADDRESSES.USDC);
const FEE_TIERS = [100, 500, 3000, 10000] as const;
const HOP_FEES = [500, 3000] as const;

export interface QuoteParams {
  tokenInAddress: string;
  tokenInDecimals: number;
  tokenInSymbol: string;
  tokenOutAddress: string;
  tokenOutDecimals: number;
  tokenOutSymbol: string;
  amountIn: string;
  slippageBps?: number;
}

export interface QuoteResult {
  amountOut: string;
  rate: number;
  priceImpactPct: number | null;
  minReceived: string;
  slippageBps: number;
  gasEth: string;
  gasUsd: number | null;
  route: string[];
  feeTiers: number[];
}

interface Candidate {
  out: bigint;
  gas: bigint;
  route: string[];
  fees: number[];
}

function hopSymbol(addr: string): string {
  return getAddress(addr) === WETH ? "WETH" : getAddress(addr) === USDC ? "USDC" : "?";
}

export async function getQuote(p: QuoteParams): Promise<QuoteResult> {
  const tokenIn = getAddress(resolveTradableAddress(p.tokenInAddress));
  const tokenOut = getAddress(resolveTradableAddress(p.tokenOutAddress));
  if (tokenIn === tokenOut) throw new Error("Select two different tokens");

  const amountInRaw = parseUnits(p.amountIn, p.tokenInDecimals);
  if (amountInRaw <= 0n) throw new Error("Enter an amount greater than zero");

  const candidates: Candidate[] = [];

  await Promise.all(
    FEE_TIERS.map(async (fee) => {
      try {
        const res = (await publicClient.readContract({
          address: QUOTER,
          abi: QUOTER_ABI,
          functionName: "quoteExactInputSingle",
          args: [{ tokenIn, tokenOut, amountIn: amountInRaw, fee, sqrtPriceLimitX96: 0n }],
        })) as readonly [bigint, bigint, number, bigint];
        if (res[0] > 0n) {
          candidates.push({ out: res[0], gas: res[3], route: [p.tokenInSymbol, p.tokenOutSymbol], fees: [fee] });
        }
      } catch {
        // No pool at this fee tier
      }
    }),
  );

  const hops = [WETH, USDC].filter((h) => h !== tokenIn && h !== tokenOut);
  await Promise.all(
    hops.flatMap((hop) =>
      HOP_FEES.flatMap((f1) =>
        HOP_FEES.map(async (f2) => {
          try {
            const path = encodePacked(
              ["address", "uint24", "address", "uint24", "address"],
              [tokenIn, f1, hop, f2, tokenOut],
            );
            const res = (await publicClient.readContract({
              address: QUOTER,
              abi: QUOTER_ABI,
              functionName: "quoteExactInput",
              args: [path, amountInRaw],
            })) as readonly [bigint, readonly bigint[], readonly number[], bigint];
            if (res[0] > 0n) {
              candidates.push({
                out: res[0],
                gas: res[3],
                route: [p.tokenInSymbol, hopSymbol(hop), p.tokenOutSymbol],
                fees: [f1, f2],
              });
            }
          } catch {
            // Route unavailable
          }
        }),
      ),
    ),
  );

  if (candidates.length === 0) {
    throw new Error(`No Uniswap V3 liquidity route found for ${p.tokenInSymbol} -> ${p.tokenOutSymbol} on Base`);
  }

  const best = candidates.reduce((a, b) => (b.out > a.out ? b : a));
  const amountOut = formatUnits(best.out, p.tokenOutDecimals);
  const rate = Number(amountOut) / Number(p.amountIn);
  const slippageBps = p.slippageBps ?? 50;
  const minRaw = (best.out * BigInt(10_000 - slippageBps)) / 10_000n;
  const minReceived = formatUnits(minRaw, p.tokenOutDecimals);

  let gasEth = "0";
  let gasUsd: number | null = null;
  let priceImpactPct: number | null = null;
  try {
    const [gasPrice, prices] = await Promise.all([
      publicClient.getGasPrice(),
      getTokensData([tokenIn.toLowerCase(), tokenOut.toLowerCase()], { withChange: false }),
    ]);
    const gasCostWei = best.gas * gasPrice;
    gasEth = formatUnits(gasCostWei, 18);

    const priceOf = (addr: string) => prices.find((t) => t.address === addr.toLowerCase())?.priceUsd ?? null;
    const ethPrice = priceOf(WETH.toLowerCase());
    if (ethPrice != null) gasUsd = Number(gasEth) * ethPrice;

    const priceIn = priceOf(tokenIn.toLowerCase());
    const priceOut = priceOf(tokenOut.toLowerCase());
    if (priceIn != null && priceOut != null && priceIn > 0) {
      const valueIn = Number(p.amountIn) * priceIn;
      const valueOut = Number(amountOut) * priceOut;
      if (valueIn > 0) priceImpactPct = Math.max(0, (1 - valueOut / valueIn) * 100);
    }
  } catch {
    // non-fatal
  }

  return {
    amountOut,
    rate,
    priceImpactPct,
    minReceived,
    slippageBps,
    gasEth,
    gasUsd,
    route: best.route,
    feeTiers: best.fees,
  };
}
