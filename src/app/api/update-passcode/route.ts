import { NextRequest, NextResponse } from "next/server";
import { lookupProfile, updateRegistryPasscode, normalizeUsername } from "@/lib/redis";
import { hashPasscode, verifyPasscode, isValidPasscode } from "@/lib/passcode";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, currentCode, newCode } = body;

    if (!username || !currentCode || !newCode) {
      return NextResponse.json(
        { error: "Missing required fields: username, currentCode, newCode" },
        { status: 400 }
      );
    }

    const name = normalizeUsername(username);
    const rec = await lookupProfile(name);
    if (!rec) {
      return NextResponse.json(
        { error: "No wallet profile found." },
        { status: 404 }
      );
    }

    if (rec.passcodeHash && !verifyPasscode(currentCode, rec.passcodeHash)) {
      return NextResponse.json(
        { error: "Your current passcode is incorrect." },
        { status: 403 }
      );
    }

    if (!isValidPasscode(newCode)) {
      return NextResponse.json(
        { error: "The new passcode must be exactly 6 digits." },
        { status: 400 }
      );
    }

    const passcodeHash = hashPasscode(newCode);
    await updateRegistryPasscode(name, passcodeHash);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
