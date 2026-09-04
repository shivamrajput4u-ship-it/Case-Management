import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { addDocument, getCase } from "../../../../../lib/db";

export async function POST(request, { params }) {
  const caseItem = await getCase(params.id);
  if (!caseItem) {
    return NextResponse.json({ error: "Case not found." }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads", String(params.id));
  fs.mkdirSync(uploadsDir, { recursive: true });

  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(uploadsDir, safeName), bytes);

  const doc = {
    name: file.name,
    url: `/uploads/${params.id}/${safeName}`,
    uploadedAt: new Date().toISOString(),
    size: bytes.length,
  };

  const updated = await addDocument(params.id, doc);
  return NextResponse.json(updated, { status: 201 });
}
