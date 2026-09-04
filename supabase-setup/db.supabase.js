// LIVE VERSION — saves to Supabase (a real, hosted database) instead of a
// local file. This is what makes data survive on a deployed/live dashboard.
//
// Setup (see README-supabase.md for full steps):
// 1. npm install @supabase/supabase-js
// 2. Copy this file over lib/db.js (replacing the local-file version)
// 3. Copy supabaseClient.js into lib/
// 4. Run schema.sql in your Supabase project's SQL Editor
// 5. Add your Supabase URL + anon key to .env.local (see .env.local.example)

import { supabase } from "./supabaseClient";

function toApiShape(row) {
  if (!row) return row;
  return {
    id: row.id,
    title: row.title,
    caseNumber: row.case_number,
    court: row.court,
    status: row.status,
    parties: row.parties,
    assignedTo: row.assigned_to,
    nextHearing: row.next_hearing,
    notes: row.notes,
    documents: row.documents || [],
    hearingHistory: row.hearing_history || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toDbShape(input) {
  const row = {};
  if (input.title !== undefined) row.title = input.title;
  if (input.caseNumber !== undefined) row.case_number = input.caseNumber;
  if (input.court !== undefined) row.court = input.court;
  if (input.status !== undefined) row.status = input.status;
  if (input.parties !== undefined) row.parties = input.parties;
  if (input.assignedTo !== undefined) row.assigned_to = input.assignedTo;
  if (input.nextHearing !== undefined) row.next_hearing = input.nextHearing;
  if (input.notes !== undefined) row.notes = input.notes;
  return row;
}

export async function getAllCases() {
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data.map(toApiShape);
}

export async function getCase(id) {
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return toApiShape(data);
}

export async function createCase(input) {
  const row = {
    ...toDbShape(input),
    hearing_history: input.nextHearing
      ? [{ date: input.nextHearing, note: "Next hearing scheduled" }]
      : [],
  };
  const { data, error } = await supabase
    .from("cases")
    .insert(row)
    .select()
    .single();
  if (error) throw error;
  return toApiShape(data);
}

export async function updateCase(id, input) {
  const existing = await getCase(id);
  if (!existing) return null;

  let hearingHistory = existing.hearingHistory || [];
  if (input.nextHearing && input.nextHearing !== existing.nextHearing) {
    hearingHistory = [
      ...hearingHistory,
      { date: input.nextHearing, note: "Hearing date updated" },
    ];
  }

  const row = {
    ...toDbShape(input),
    hearing_history: hearingHistory,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("cases")
    .update(row)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return toApiShape(data);
}

export async function deleteCase(id) {
  const { error } = await supabase.from("cases").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function addDocument(id, doc) {
  const existing = await getCase(id);
  if (!existing) return null;
  const documents = [...(existing.documents || []), doc];
  const { data, error } = await supabase
    .from("cases")
    .update({ documents, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return toApiShape(data);
}
