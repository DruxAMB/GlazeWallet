import { CdpClient } from "@coinbase/cdp-sdk";
import { formatUnits } from "viem";

import { BASE_ADDRESSES, NATIVE_ETH_ADDRESS, getPublicClient, usdcAddress } from "./base-client";
import { getTokensData, type TokenData } from "./geckoterminal";

const CDP_NATIVE_ETH = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
const CDP_NATIVE_ETH_SENTINEL = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" as const;

export interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  raw: string;
  formatted: string;
  priceUsd: number | null;
  usdValue: number | null;
  logoURI: string | null;
  change24h: number | null;
}

export interface WalletBalances {
  address: string;
  network: string;
  eth: TokenBalance;
  usdc: TokenBalance;
  tokens: TokenBalance[];
}

let _client: CdpClient | null = null;

export function getCdpClient(): CdpClient {
  if (_client) return _client;

  const apiKeyId = process.env.CDP_API_KEY_ID;
  const apiKeySecret = process.env.CDP_API_KEY_SECRET;
  const walletSecret = process.env.CDP_WALLET_SECRET;

  if (!apiKeyId || !apiKeySecret || !walletSecret) {
    throw new Error("Missing CDP environment variables");
  }

  _client = new CdpClient({
    apiKeyId,
    apiKeySecret,
    walletSecret,
  });

  return _client;
}

export function accountNameForUsername(username: string): string {
  return `glazewallet-${username.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export async function getAccountForUsername(username: string) {
  const client = getCdpClient();
  const name = accountNameForUsername(username);
  return client.evm.getOrCreateAccount({ name });
}

function emptyBalance(address: string, symbol: string, name: string, decimals: number): TokenBalance {
  return { address, symbol, name, decimals, raw: "0", formatted: "0", priceUsd: null, usdValue: null, logoURI: null, change24h: null };
}

export async function getWalletBalances(username: string): Promise<WalletBalances> {
  const cdp = getCdpClient();
  const account = await getAccountForUsername(username);
  const { balances } = await cdp.evm.listTokenBalances({ address: account.address, network: "base" });

  const usdc = BASE_ADDRESSES.USDC.toLowerCase();
  const weth = BASE_ADDRESSES.WETH.toLowerCase();

  let eth = emptyBalance(NATIVE_ETH_ADDRESS, "ETH", "Ethereum", 18);
  let usdcBalance = emptyBalance(usdc, "USDC", "USD Coin", 6);
  const tokens: TokenBalance[] = [];

  for (const b of balances) {
    const addr = b.token.contractAddress.toLowerCase();
    const decimals = b.amount.decimals;
    const raw = b.amount.amount.toString();
    const formatted = formatUnits(b.amount.amount, decimals);
    const symbol = b.token.symbol ?? "";
    const name = b.token.name ?? symbol ?? "Token";
    const entry: TokenBalance = { address: addr, symbol, name, decimals, raw, formatted, priceUsd: null, usdValue: null, logoURI: null, change24h: null };

    if (addr === CDP_NATIVE_ETH || symbol.toUpperCase() === "ETH") {
      eth = { ...entry, symbol: "ETH", name: "Ethereum", address: NATIVE_ETH_ADDRESS };
    } else if (addr === usdc || symbol.toUpperCase() === "USDC") {
      usdcBalance = { ...entry, symbol: "USDC", name: "USD Coin", address: usdc };
    } else if (addr !== weth && b.amount.amount > 0n) {
      tokens.push(entry);
    }
  }

  let dataByAddr = new Map<string, TokenData>();
  try {
    const data = await getTokensData([weth, usdc, ...tokens.map((t) => t.address)]);
    dataByAddr = new Map(data.map((d) => [d.address.toLowerCase(), d]));
  } catch {
    // non-fatal
  }

  const enrich = (b: TokenBalance, lookup: string): TokenBalance => {
    const d = dataByAddr.get(lookup);
    const priceUsd = d?.priceUsd ?? null;
    return {
      ...b,
      priceUsd,
      usdValue: priceUsd != null ? Number(b.formatted) * priceUsd : null,
      logoURI: d?.imageUrl ?? b.logoURI,
      change24h: d?.change24h ?? null,
    };
  };

  eth = enrich(eth, weth);
  usdcBalance = enrich(usdcBalance, usdc);
  if (usdcBalance.priceUsd == null) {
    usdcBalance = { ...usdcBalance, priceUsd: 1, usdValue: Number(usdcBalance.formatted) };
  }
  const enrichedTokens = tokens
    .map((t) => enrich(t, t.address))
    .sort((a, b) => (b.usdValue ?? 0) - (a.usdValue ?? 0));

  return { address: account.address, network: "base", eth, usdc: usdcBalance, tokens: enrichedTokens };
}

export async function estimateSendFee(token: "eth" | "usdc"): Promise<{ gasEth: string }> {
  const gasPrice = await getPublicClient().getGasPrice();
  const gasLimit = token === "usdc" ? 65000n : 21000n;
  return { gasEth: formatUnits(gasPrice * gasLimit, 18) };
}

export { CDP_NATIVE_ETH_SENTINEL, NATIVE_ETH_ADDRESS };
