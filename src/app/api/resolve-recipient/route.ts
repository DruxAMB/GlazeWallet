import { NextRequest, NextResponse } from "next/server";
import { resolveWalletAddress, usernameForAddress, normalizeUsername } from "@/lib/redis";

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Missing required field: query" },
        { status: 400 }
      );
    }

    const trimmed = query.trim().replace(/^@/, "");

    if (ADDRESS_RE.test(trimmed)) {
      const username = await usernameForAddress(trimmed).catch(() => null);
      return NextResponse.json({ address: trimmed, username });
    }

    const address = await resolveWalletAddress(trimmed);
    if (!address) {
      return NextResponse.json(
        { error: `No wallet is registered for "@${trimmed}".` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      address,
      username: normalizeUsername(trimmed),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
