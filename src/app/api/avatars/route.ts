import { NextResponse } from "next/server";
import { getAvatarCatalog } from "@/lib/redis";

export async function GET() {
  try {
    const avatars = await getAvatarCatalog();
    return NextResponse.json({ avatars, source: avatars.length > 0 ? "redis" : "empty" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
