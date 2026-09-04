"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { pillClassFor } from "../../utils";

export default function CaseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [caseItem, setCaseItem] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef(null);

  function load() {
    fetch(`/api/cases/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setCaseItem(data);
          setForm(data);
        }
      });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave() {
    const res = await fetch(`/api/cases/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    setCaseItem(updated);
    setEditing(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this case? This can't be undone.")) return;
    await fetch(`/api/cases/${id}`, { method: "DELETE" });
    router.push("/cases");
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`/api/cases/${id}/documents`, {
      method: "POST",
      body: fd,
    });
    const updated = await res.json();
    setCaseItem(updated);
    setUploading(false);
    if (fileInput.current) fileInput.current.value = "";
  }

  if (!caseItem) {
    return <p style={{ color: "var(--slate)" }}>Loading case…</p>;
  }

  return (
    <div>
      <Link href="/cases" className="back-link">← Back to all cases</Link>

      <div className="top-bar">
        <div>
          <h1 className="page-title">{caseItem.title}</h1>
          <p className="page-sub" style={{ marginBottom: 0 }}>
            {caseItem.caseNumber || "No case number"} · {caseItem.court || "Court not set"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className={`pill ${pillClassFor(caseItem.status)}`}>{caseItem.status}</span>
          {!editing && (
            <button className="btn btn-ghost" onClick={() => setEditing(true)}>
              Edit
            </button>
          )}
        </div>
      </div>

      {editing ? (
        <div style={{ maxWidth: 640 }}>
          <div className="field">
            <label>Case title</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="form-grid">
            <div className="field">
              <label>Case number</label>
              <input value={form.caseNumber} onChange={(e) => set("caseNumber", e.target.value)} />
            </div>
            <div className="field">
              <label>Court</label>
              <input value={form.court} onChange={(e) => set("court", e.target.value)} />
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
              <input value={form.assignedTo} onChange={(e) => set("assignedTo", e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Parties</label>
            <input value={form.parties} onChange={(e) => set("parties", e.target.value)} />
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
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary" onClick={handleSave}>Save changes</button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setForm(caseItem);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="detail-grid">
          <div>
            <p className="section-label">CASE DETAILS</p>
            <div className="panel" style={{ marginBottom: 28 }}>
              <p style={{ margin: "0 0 10px 0" }}>
                <strong>Parties:</strong> {caseItem.parties || "Not recorded"}
              </p>
              <p style={{ margin: "0 0 10px 0" }}>
                <strong>Assigned to:</strong> {caseItem.assignedTo || "Unassigned"}
              </p>
              <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                <strong>Notes:</strong>{" "}
                {caseItem.notes || "No notes yet."}
              </p>
            </div>

            <p className="section-label">DOCUMENTS</p>
            <div className="panel">
              {(caseItem.documents || []).length === 0 ? (
                <p style={{ color: "var(--slate)", fontSize: 14 }}>No documents uploaded yet.</p>
              ) : (
                caseItem.documents.map((doc, i) => (
                  <div className="doc-row" key={i}>
                    <a href={doc.url} target="_blank" rel="noreferrer">{doc.name}</a>
                    <span style={{ color: "var(--slate)" }}>
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
              <div style={{ marginTop: 14 }}>
                <input
                  ref={fileInput}
                  type="file"
                  onChange={handleUpload}
                  style={{ fontSize: 13 }}
                  disabled={uploading}
                />
                {uploading && <span style={{ fontSize: 13, color: "var(--slate)" }}> Uploading…</span>}
              </div>
            </div>
          </div>

          <div>
            <p className="section-label">HEARING HISTORY</p>
            <div className="panel" style={{ marginBottom: 28 }}>
              {(caseItem.hearingHistory || []).length === 0 ? (
                <p style={{ color: "var(--slate)", fontSize: 14 }}>No hearings recorded yet.</p>
              ) : (
                [...caseItem.hearingHistory].reverse().map((h, i) => (
                  <div className="hearing-item" key={i}>
                    <div className="date">{h.date}</div>
                    <div className="note">{h.note}</div>
                  </div>
                ))
              )}
            </div>

            <button className="btn btn-danger" onClick={handleDelete}>
              Delete this case
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
