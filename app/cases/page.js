"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { pillClassFor } from "../utils";

export default function CasesPage() {
  const [cases, setCases] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cases")
      .then((res) => res.json())
      .then((data) => {
        setCases(data);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return cases
      .filter((c) => statusFilter === "All" || c.status === statusFilter)
      .filter((c) => {
        const q = query.toLowerCase();
        if (!q) return true;
        return (
          c.title.toLowerCase().includes(q) ||
          (c.caseNumber || "").toLowerCase().includes(q) ||
          (c.parties || "").toLowerCase().includes(q) ||
          (c.court || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [cases, query, statusFilter]);

  return (
    <div>
      <div className="top-bar">
        <div>
          <h1 className="page-title">All cases</h1>
          <p className="page-sub" style={{ marginBottom: 0 }}>
            {cases.length} case{cases.length === 1 ? "" : "s"} in the register.
          </p>
        </div>
        <Link href="/cases/new" className="btn btn-primary">
          + Add a case
        </Link>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <input
          className="search-input"
          placeholder="Search by title, case number, party, court…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="search-input"
          style={{ minWidth: 140 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Urgent</option>
          <option>Closed</option>
        </select>
      </div>

      {loading ? (
        <p style={{ color: "var(--slate)" }}>Loading register…</p>
      ) : filtered.length === 0 ? (
        <div className="empty">
          {cases.length === 0 ? (
            <>No cases yet. <Link href="/cases/new">Add your first case</Link>.</>
          ) : (
            "No cases match this search."
          )}
        </div>
      ) : (
        <div className="register">
          {filtered.map((c, i) => (
            <Link href={`/cases/${c.id}`} key={c.id} className="register-row">
              <div className="register-index">{String(i + 1).padStart(2, "0")}</div>
              <div className="register-main">
                <p className="case-title">{c.title}</p>
                <p className="case-meta">
                  {c.caseNumber || "No case number"} · {c.court || "Court not set"}
                  {c.assignedTo ? ` · ${c.assignedTo}` : ""}
                </p>
              </div>
              <span className={`pill ${pillClassFor(c.status)}`}>{c.status}</span>
              <div className="register-hearing">
                <div className="date">{c.nextHearing || "—"}</div>
                <div>{c.nextHearing ? "next hearing" : "no hearing set"}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
