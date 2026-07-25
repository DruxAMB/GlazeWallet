import { CdpClient } from "@coinbase/cdp-sdk";

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
