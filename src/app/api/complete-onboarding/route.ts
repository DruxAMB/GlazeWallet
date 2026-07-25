import { NextRequest, NextResponse } from "next/server";
import { registerUsername, checkUsername, normalizeUsername } from "@/lib/redis";
import { hashPasscode, isValidPasscode } from "@/lib/passcode";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, address, avatarData, passcode } = body;

    if (!username || !address) {
      return NextResponse.json(
        { error: "Missing required fields: username, address" },
        { status: 400 }
      );
    }

    if (!passcode || !isValidPasscode(passcode)) {
      return NextResponse.json(
        { error: "Set a 6-digit passcode to secure your wallet." },
        { status: 400 }
      );
    }

    const name = normalizeUsername(username);
    const check = await checkUsername(name, address);
    if (!check.available) {
      return NextResponse.json(
        { error: check.reason ?? "That username isn't available." },
        { status: 409 }
      );
    }

    const passcodeHash = hashPasscode(passcode);
    const record = await registerUsername(name, {
      walletAddress: address,
      avatarData: typeof avatarData === "string" ? avatarData : "",
      passcodeHash,
    });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
