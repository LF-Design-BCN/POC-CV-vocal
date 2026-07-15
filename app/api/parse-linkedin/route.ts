import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { extractLinkedInSummary } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Fichier PDF manquant" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Le fichier doit être un PDF (export LinkedIn)" },
      { status: 400 }
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const parsed = await pdfParse(buffer);

    if (!parsed.text || parsed.text.trim().length < 50) {
      return NextResponse.json(
        { error: "Impossible d'extraire du texte de ce PDF" },
        { status: 422 }
      );
    }

    const linkedinSummary = await extractLinkedInSummary(parsed.text);

    // Le lien du profil apparaît parfois dans l'export PDF lui-même ; on le
    // récupère par une simple regex plutôt que de demander à l'utilisateur
    // de le ressaisir à la main.
    const urlMatch = parsed.text.match(
      /(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9\-_%]+/i
    );
    const linkedinUrl = urlMatch
      ? urlMatch[0].startsWith("http")
        ? urlMatch[0]
        : `https://${urlMatch[0]}`
      : "";

    return NextResponse.json({ linkedinSummary, linkedinUrl });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Erreur lors du traitement du PDF", details: err.message },
      { status: 500 }
    );
  }
}
