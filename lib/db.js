import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    const seed = { cases: [], nextId: 1 };
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2));
  }
}

export function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

export function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function getAllCases() {
  return readDb().cases;
}

export function getCase(id) {
  return readDb().cases.find((c) => c.id === Number(id));
}

export function createCase(input) {
  const db = readDb();
  const id = db.nextId;
  const now = new Date().toISOString();
  const newCase = {
    id,
    title: input.title || "Untitled matter",
    caseNumber: input.caseNumber || "",
    court: input.court || "",
    status: input.status || "Active",
    parties: input.parties || "",
    assignedTo: input.assignedTo || "",
    nextHearing: input.nextHearing || "",
    notes: input.notes || "",
    documents: [],
    hearingHistory: input.nextHearing
      ? [{ date: input.nextHearing, note: "Next hearing scheduled" }]
      : [],
    createdAt: now,
    updatedAt: now,
  };
  db.cases.push(newCase);
  db.nextId = id + 1;
  writeDb(db);
  return newCase;
}

export function updateCase(id, input) {
  const db = readDb();
  const idx = db.cases.findIndex((c) => c.id === Number(id));
  if (idx === -1) return null;
  const existing = db.cases[idx];

  // If hearing date changed, log it in history
  let hearingHistory = existing.hearingHistory || [];
  if (input.nextHearing && input.nextHearing !== existing.nextHearing) {
    hearingHistory = [
      ...hearingHistory,
      { date: input.nextHearing, note: "Hearing date updated" },
    ];
  }

  const updated = {
    ...existing,
    ...input,
    hearingHistory,
    updatedAt: new Date().toISOString(),
  };
  db.cases[idx] = updated;
  writeDb(db);
  return updated;
}

export function deleteCase(id) {
  const db = readDb();
  db.cases = db.cases.filter((c) => c.id !== Number(id));
  writeDb(db);
  return true;
}

export function addDocument(id, doc) {
  const db = readDb();
  const idx = db.cases.findIndex((c) => c.id === Number(id));
  if (idx === -1) return null;
  db.cases[idx].documents = [...(db.cases[idx].documents || []), doc];
  db.cases[idx].updatedAt = new Date().toISOString();
  writeDb(db);
  return db.cases[idx];
}
