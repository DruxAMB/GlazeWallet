import { NextRequest, NextResponse } from "next/server";
import { lookupProfile, normalizeUsername } from "@/lib/redis";
import { verifyPasscode } from "@/lib/passcode";
import { accountNameForUsername } from "@/lib/cdp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, passcode } = body;

    if (!username || !passcode) {
      return NextResponse.json(
        { error: "Missing required fields: username, passcode" },
        { status: 400 }
      );
    }

    const name = normalizeUsername(username);
    const rec = await lookupProfile(name);
    if (!rec) return NextResponse.json({ ok: false });
    if (!rec.passcodeHash || !verifyPasscode(passcode, rec.passcodeHash)) {
      return NextResponse.json({ ok: false });
    }

    return NextResponse.json({
      ok: true,
      address: rec.walletAddress,
      username: name,
      accountName: accountNameForUsername(name),
      avatarData: rec.avatarData || "",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
