import { NextRequest, NextResponse } from "next/server";
import { loadProfile } from "@/lib/store";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id manquant" }, { status: 400 });
  }
  const profile = await loadProfile(id);
  return NextResponse.json({ ready: !!profile });
}
