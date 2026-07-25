import { NextRequest, NextResponse } from "next/server";
import { checkUsername } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, address } = body;

    if (!username) {
      return NextResponse.json(
        { error: "Missing required field: username" },
        { status: 400 }
      );
    }

    const result = await checkUsername(username, address);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
