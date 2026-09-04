import { NextResponse } from "next/server";
import { getAllCases, createCase } from "../../../lib/db";

export async function GET() {
  const cases = await getAllCases();
  return NextResponse.json(cases);
}

export async function POST(request) {
  const body = await request.json();
  if (!body.title || !body.title.trim()) {
    return NextResponse.json(
      { error: "A case title is required." },
      { status: 400 }
    );
  }
  const created = await createCase(body);
  return NextResponse.json(created, { status: 201 });
}
