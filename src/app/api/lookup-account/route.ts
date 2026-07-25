import { NextRequest, NextResponse } from "next/server";
import { lookupProfile, normalizeUsername } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: "Missing required field: username" },
        { status: 400 }
      );
    }

    const name = normalizeUsername(username);
    const rec = await lookupProfile(name).catch(() => null);
    if (!rec) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json({
      username: name,
      walletAddress: rec.walletAddress,
      avatarData: rec.avatarData || "",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
