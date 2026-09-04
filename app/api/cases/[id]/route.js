import { NextResponse } from "next/server";
import { getCase, updateCase, deleteCase } from "../../../../lib/db";

export async function GET(request, { params }) {
  const item = await getCase(params.id);
  if (!item) {
    return NextResponse.json({ error: "Case not found." }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function PUT(request, { params }) {
  const body = await request.json();
  const updated = await updateCase(params.id, body);
  if (!updated) {
    return NextResponse.json({ error: "Case not found." }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  await deleteCase(params.id);
  return NextResponse.json({ ok: true });
}
