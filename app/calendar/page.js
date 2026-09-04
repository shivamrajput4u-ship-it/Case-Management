"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default function CalendarPage() {
  const [cases, setCases] = useState([]);
  const [cursor, setCursor] = useState(startOfMonth(new Date()));

  useEffect(() => {
    fetch("/api/cases")
      .then((res) => res.json())
      .then(setCases);
  }, []);

  const byDate = {};
  cases.forEach((c) => {
    if (!c.nextHearing) return;
    byDate[c.nextHearing] = byDate[c.nextHearing] || [];
    byDate[c.nextHearing].push(c);
  });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  const monthLabel = cursor.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <div className="top-bar">
        <div>
          <h1 className="page-title">Hearing calendar</h1>
          <p className="page-sub" style={{ marginBottom: 0 }}>
            Every date with a hearing scheduled.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-ghost"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
          >
            ← Prev
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => setCursor(startOfMonth(new Date()))}
          >
            Today
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
          >
            Next →
          </button>
        </div>
      </div>

      <p className="section-label" style={{ marginBottom: 4 }}>{monthLabel.toUpperCase()}</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
          background: "var(--border)",
          border: "1px solid var(--border)",
          marginTop: 12,
          marginBottom: 36,
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            style={{
              background: "var(--paper)",
              padding: "8px 10px",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--slate)",
            }}
          >
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={i} style={{ background: "var(--paper-raised)", minHeight: 90 }} />;
          }
          const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
          const items = byDate[dateStr] || [];
          const isToday = dateStr === todayStr;
          return (
            <div
              key={i}
              style={{
                background: "var(--paper-raised)",
                minHeight: 90,
                padding: 8,
                borderTop: isToday ? "2px solid var(--brass)" : undefined,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: isToday ? 700 : 500,
                  color: isToday ? "var(--brass)" : "var(--ink)",
                  marginBottom: 4,
                }}
              >
                {day}
              </div>
              {items.map((c) => (
                <Link
                  key={c.id}
                  href={`/cases/${c.id}`}
                  style={{
                    display: "block",
                    fontSize: 11,
                    background: "var(--pending-bg)",
                    color: "var(--pending)",
                    borderRadius: 2,
                    padding: "2px 5px",
                    marginBottom: 3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.title}
                </Link>
              ))}
            </div>
          );
        })}
      </div>

      <p className="section-label">ALL SCHEDULED HEARINGS</p>
      <div className="register">
        {Object.keys(byDate)
          .sort()
          .flatMap((date) =>
            byDate[date].map((c) => (
              <Link href={`/cases/${c.id}`} key={c.id} className="register-row">
                <div className="register-index" style={{ visibility: "hidden" }}>00</div>
                <div className="register-main">
                  <p className="case-title">{c.title}</p>
                  <p className="case-meta">{c.caseNumber || "No case number"}</p>
                </div>
                <div />
                <div className="register-hearing">
                  <div className="date">{date}</div>
                </div>
              </Link>
            ))
          )}
        {Object.keys(byDate).length === 0 && (
          <div className="empty">No hearings scheduled yet.</div>
        )}
      </div>
    </div>
  );
}
