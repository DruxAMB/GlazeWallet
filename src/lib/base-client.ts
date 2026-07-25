import { createPublicClient, fallback, http, type PublicClient } from "viem";
import { base } from "viem/chains";

export const publicClient = createPublicClient({
  chain: base,
  transport: fallback([
    http("https://mainnet.base.org"),
    http("https://base.llamarpc.com"),
    http("https://base-rpc.publicnode.com"),
    http("https://base.drpc.org"),
  ]),
});

export function getPublicClient(): PublicClient {
  return publicClient as unknown as PublicClient;
}

export const BASE_ADDRESSES = {
  WETH: "0x4200000000000000000000000000000000000006",
  USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  QUOTER_V2: "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a",
} as const;

export function usdcAddress(): string {
  return BASE_ADDRESSES.USDC;
}

export const NATIVE_ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export function resolveTradableAddress(address: string): string {
  return address.toLowerCase() === NATIVE_ETH_ADDRESS ? BASE_ADDRESSES.WETH : address;
}
