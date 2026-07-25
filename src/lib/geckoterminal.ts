const API = "https://api.geckoterminal.com/api/v2";
const NETWORK = "base";
const HEADERS = { Accept: "application/json;version=20230302" };

export interface TokenData {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  imageUrl: string | null;
  priceUsd: number | null;
  change24h: number | null;
  volume24h: number | null;
}

export interface TrendingToken extends TokenData {
  poolName: string;
}

const cache = new Map<string, { at: number; value: unknown }>();

async function fetchJson<T>(path: string, ttlMs: number): Promise<T> {
  const cached = cache.get(path);
  if (cached && Date.now() - cached.at < ttlMs) {
    return cached.value as T;
  }
  const res = await fetch(`${API}${path}`, { headers: HEADERS });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GeckoTerminal ${res.status} ${res.statusText}${body ? ` - ${body.slice(0, 200)}` : ""}`);
  }
  const json = (await res.json()) as T;
  cache.set(path, { at: Date.now(), value: json });
  return json;
}

const num = (v: unknown): number | null => {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : null;
};

interface GtToken {
  id: string;
  attributes: {
    address: string;
    name: string;
    symbol: string;
    decimals: number | null;
    image_url: string | null;
    price_usd: string | null;
    volume_usd?: { h24?: string | null };
  };
  relationships?: { top_pools?: { data?: Array<{ id: string }> } };
}

const poolIdToAddress = (id: string): string => id.replace(/^base_/, "").toLowerCase();
const validImage = (url: string | null): string | null => (url && url !== "missing.png" ? url : null);

export async function getTokensData(addresses: string[], options?: { withChange?: boolean }): Promise<TokenData[]> {
  const withChange = options?.withChange ?? true;
  const unique = [...new Set(addresses.map((a) => a.toLowerCase()))].slice(0, 30);
  if (unique.length === 0) return [];

  const resp = await fetchJson<{ data: GtToken[] }>(
    `/networks/${NETWORK}/tokens/multi/${unique.join(",")}`,
    15_000,
  );

  const tokens = resp.data ?? [];
  const topPoolByToken = new Map<string, string>();
  const results: TokenData[] = tokens.map((t) => {
    const addr = t.attributes.address.toLowerCase();
    const topPool = t.relationships?.top_pools?.data?.[0]?.id;
    if (topPool) topPoolByToken.set(addr, poolIdToAddress(topPool));
    return {
      address: addr,
      symbol: t.attributes.symbol,
      name: t.attributes.name,
      decimals: t.attributes.decimals ?? 18,
      imageUrl: validImage(t.attributes.image_url),
      priceUsd: num(t.attributes.price_usd),
      change24h: null,
      volume24h: num(t.attributes.volume_usd?.h24),
    };
  });

  const poolAddrs = [...new Set([...topPoolByToken.values()])].slice(0, 30);
  if (withChange && poolAddrs.length > 0) {
    try {
      const poolsResp = await fetchJson<{
        data: Array<{
          attributes: { address: string; price_change_percentage?: { h24?: string | null } };
          relationships?: { base_token?: { data?: { id?: string } } };
        }>;
      }>(`/networks/${NETWORK}/pools/multi/${poolAddrs.join(",")}`, 15_000);

      const changeByBaseToken = new Map<string, number | null>();
      for (const pool of poolsResp.data ?? []) {
        const baseTokenId = pool.relationships?.base_token?.data?.id;
        if (!baseTokenId) continue;
        const baseAddr = poolIdToAddress(baseTokenId);
        changeByBaseToken.set(baseAddr, num(pool.attributes.price_change_percentage?.h24));
      }
      for (const r of results) {
        if (changeByBaseToken.has(r.address)) r.change24h = changeByBaseToken.get(r.address) ?? null;
      }
    } catch {
      // non-fatal
    }
  }

  return results;
}

interface GtPool {
  attributes: {
    name: string;
    address: string;
    base_token_price_usd: string | null;
    price_change_percentage?: { h24?: string | null };
    volume_usd?: { h24?: string | null };
  };
  relationships?: { base_token?: { data?: { id?: string } } };
}

export async function getTrending(): Promise<TrendingToken[]> {
  const resp = await fetchJson<{ data: GtPool[]; included?: GtToken[] }>(
    `/networks/${NETWORK}/trending_pools?include=base_token&page=1`,
    30_000,
  );

  const tokenById = new Map<string, GtToken>();
  for (const inc of resp.included ?? []) tokenById.set(inc.id, inc);

  const seen = new Set<string>();
  const trending: TrendingToken[] = [];
  for (const pool of resp.data ?? []) {
    const baseId = pool.relationships?.base_token?.data?.id;
    const token = baseId ? tokenById.get(baseId) : undefined;
    if (!token) continue;
    const addr = token.attributes.address.toLowerCase();
    if (seen.has(addr)) continue;
    seen.add(addr);
    trending.push({
      address: addr,
      symbol: token.attributes.symbol,
      name: token.attributes.name,
      decimals: token.attributes.decimals ?? 18,
      imageUrl: validImage(token.attributes.image_url),
      priceUsd: num(pool.attributes.base_token_price_usd),
      change24h: num(pool.attributes.price_change_percentage?.h24),
      volume24h: num(pool.attributes.volume_usd?.h24),
      poolName: pool.attributes.name,
    });
    if (trending.length >= 12) break;
  }
  return trending;
}

export async function searchTokens(query: string): Promise<TokenData[]> {
  const q = query.trim();
  if (!q) return [];
  const resp = await fetchJson<{ data: GtPool[]; included?: GtToken[] }>(
    `/search/pools?query=${encodeURIComponent(q)}&network=${NETWORK}&include=base_token&page=1`,
    30_000,
  );
  const tokenById = new Map<string, GtToken>();
  for (const inc of resp.included ?? []) tokenById.set(inc.id, inc);

  const seen = new Set<string>();
  const results: TokenData[] = [];
  for (const pool of resp.data ?? []) {
    const baseId = pool.relationships?.base_token?.data?.id;
    const token = baseId ? tokenById.get(baseId) : undefined;
    if (!token) continue;
    const addr = token.attributes.address.toLowerCase();
    if (seen.has(addr)) continue;
    seen.add(addr);
    results.push({
      address: addr,
      symbol: token.attributes.symbol,
      name: token.attributes.name,
      decimals: token.attributes.decimals ?? 18,
      imageUrl: validImage(token.attributes.image_url),
      priceUsd: num(pool.attributes.base_token_price_usd),
      change24h: num(pool.attributes.price_change_percentage?.h24),
      volume24h: num(pool.attributes.volume_usd?.h24),
    });
    if (results.length >= 20) break;
  }
  return results;
}
