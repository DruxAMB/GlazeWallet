import { NextResponse } from "next/server";
import { getTrending } from "@/lib/geckoterminal";

export async function GET() {
  try {
    const trending = await getTrending();
    return NextResponse.json(trending);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
