"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const EMPTY = {
  title: "",
  caseNumber: "",
  court: "",
  status: "Active",
  parties: "",
  assignedTo: "",
  nextHearing: "",
  notes: "",
};

export default function NewCasePage() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) {
      setError("Case title is required.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Couldn't save the case.");
      return;
    }
    const created = await res.json();
    router.push(`/cases/${created.id}`);
  }

  return (
    <div>
      <Link href="/cases" className="back-link">← Back to all cases</Link>
      <h1 className="page-title">Add a case</h1>
      <p className="page-sub">Enter what you know now — you can fill in the rest later.</p>

      <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        <div className="field">
          <label>Case title</label>
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Sharma vs. Metro Builders Pvt Ltd"
          />
        </div>

        <div className="form-grid">
          <div className="field">
            <label>Case number</label>
            <input
              value={form.caseNumber}
              onChange={(e) => set("caseNumber", e.target.value)}
              placeholder="e.g. CS/2026/1042"
            />
          </div>
          <div className="field">
            <label>Court</label>
            <input
              value={form.court}
              onChange={(e) => set("court", e.target.value)}
              placeholder="e.g. District Court, Faridabad"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option>Active</option>
              <option>Pending</option>
              <option>Urgent</option>
              <option>Closed</option>
            </select>
          </div>
          <div className="field">
            <label>Assigned to</label>
            <input
              value={form.assignedTo}
              onChange={(e) => set("assignedTo", e.target.value)}
              placeholder="e.g. Adv. R. Mehta"
            />
          </div>
        </div>

        <div className="field">
          <label>Parties</label>
          <input
            value={form.parties}
            onChange={(e) => set("parties", e.target.value)}
            placeholder="e.g. Petitioner: A. Sharma · Respondent: Metro Builders"
          />
        </div>

        <div className="field">
          <label>Next hearing date</label>
          <input
            type="date"
            value={form.nextHearing}
            onChange={(e) => set("nextHearing", e.target.value)}
          />
        </div>

        <div className="field">
          <label>Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Anything worth flagging for whoever opens this case next."
          />
        </div>

        {error && (
          <p style={{ color: "var(--alert)", fontSize: 13, marginBottom: 16 }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save case"}
          </button>
          <Link href="/cases" className="btn btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
