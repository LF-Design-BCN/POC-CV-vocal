import { NextRequest, NextResponse } from "next/server";
import { saveSelectedTemplate } from "@/lib/store";
import { TEMPLATES } from "@/lib/templates";

export async function POST(req: NextRequest) {
  const { profileId, templateId } = await req.json();

  if (!profileId || !templateId) {
    return NextResponse.json(
      { error: "profileId et templateId sont requis" },
      { status: 400 }
    );
  }

  if (!TEMPLATES.some((t) => t.id === templateId)) {
    return NextResponse.json({ error: "templateId inconnu" }, { status: 400 });
  }

  await saveSelectedTemplate(profileId, templateId);
  return NextResponse.json({ ok: true });
}
