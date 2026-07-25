import { NextRequest, NextResponse } from "next/server";
import { getAccountForUsername, accountNameForUsername } from "@/lib/cdp";

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

    const account = await getAccountForUsername(username);

    return NextResponse.json({
      success: true,
      address: account.address,
      network: "base",
      accountName: accountNameForUsername(username),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
