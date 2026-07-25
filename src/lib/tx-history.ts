import { formatUnits } from "viem";

const BLOCKSCOUT = "https://base.blockscout.com/api/v2";

export interface HistoryEntry {
  hash: string;
  timestamp: number;
  direction: "in" | "out";
  amount: string;
  symbol: string;
  tokenName: string;
  logoURI: string | null;
  counterparty: string;
  kind: "token" | "native";
}

interface Addr {
  hash?: string | null;
}
interface TokenTransferItem {
  timestamp?: string;
  transaction_hash?: string;
  from?: Addr;
  to?: Addr;
  total?: { value?: string | null; decimals?: string | null };
  token?: { symbol?: string | null; name?: string | null; decimals?: string | null; icon_url?: string | null };
}
interface TxItem {
  hash?: string;
  timestamp?: string;
  value?: string;
  from?: Addr;
  to?: Addr;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": "GlazeWallet" } });
  if (!res.ok) throw new Error(`Blockscout ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

const lc = (a?: string | null): string => (a ?? "").toLowerCase();
const ms = (iso?: string): number => {
  const t = iso ? Date.parse(iso) : NaN;
  return Number.isFinite(t) ? t : Date.now();
};

export async function getTransactionHistory(address: string): Promise<HistoryEntry[]> {
  const addr = lc(address);
  if (!/^0x[a-f0-9]{40}$/.test(addr)) return [];

  const [transfers, txs] = await Promise.allSettled([
    fetchJson<{ items?: TokenTransferItem[] }>(`${BLOCKSCOUT}/addresses/${addr}/token-transfers?type=ERC-20`),
    fetchJson<{ items?: TxItem[] }>(`${BLOCKSCOUT}/addresses/${addr}/transactions`),
  ]);

  const entries: HistoryEntry[] = [];

  if (transfers.status === "fulfilled") {
    for (const it of transfers.value.items ?? []) {
      const from = lc(it.from?.hash);
      const to = lc(it.to?.hash);
      const direction = to === addr ? "in" : from === addr ? "out" : null;
      if (!direction || !it.transaction_hash) continue;
      const decimals = Number(it.total?.decimals ?? it.token?.decimals ?? "18") || 18;
      let amount = "0";
      try {
        amount = formatUnits(BigInt(it.total?.value ?? "0"), decimals);
      } catch {
        amount = "0";
      }
      entries.push({
        hash: it.transaction_hash,
        timestamp: ms(it.timestamp),
        direction,
        amount,
        symbol: it.token?.symbol || "?",
        tokenName: it.token?.name || it.token?.symbol || "Token",
        logoURI: it.token?.icon_url ?? null,
        counterparty: direction === "in" ? from : to,
        kind: "token",
      });
    }
  }

  if (txs.status === "fulfilled") {
    for (const it of txs.value.items ?? []) {
      let value = 0n;
      try {
        value = BigInt(it.value ?? "0");
      } catch {
        value = 0n;
      }
      if (value <= 0n || !it.hash) continue;
      const from = lc(it.from?.hash);
      const to = lc(it.to?.hash);
      const direction = to === addr ? "in" : from === addr ? "out" : null;
      if (!direction) continue;
      entries.push({
        hash: it.hash,
        timestamp: ms(it.timestamp),
        direction,
        amount: formatUnits(value, 18),
        symbol: "ETH",
        tokenName: "Ethereum",
        logoURI: null,
        counterparty: direction === "in" ? from : to,
        kind: "native",
      });
    }
  }

  entries.sort((a, b) => b.timestamp - a.timestamp);
  return entries.slice(0, 60);
}
