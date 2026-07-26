import { NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "https://temp-glazewallet.vercel.app",
  "http://localhost:3000",
  "app://glazewallet",
  "file://",
];

export function corsHeaders(origin?: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  } else {
    headers["Access-Control-Allow-Origin"] = "*";
  }
  return headers;
}

export function corsResponse(origin?: string) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export function withCors(response: NextResponse, origin?: string): NextResponse {
  const headers = corsHeaders(origin);
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
  return response;
}
