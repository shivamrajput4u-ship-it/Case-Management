import Link from "next/link";
import { getAllCases } from "../lib/db";
import { pillClassFor } from "./utils";

function daysUntil(dateStr) {
  if (!dateStr) return Infinity;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return Math.round((target - now) / (1000 * 60 * 60 * 24));
}

export default function DashboardPage() {
  const cases = getAllCases();

  const active = cases.filter((c) => c.status === "Active").length;
  const pending = cases.filter((c) => c.status === "Pending").length;
  const closed = cases.filter((c) => c.status === "Closed").length;

  const upcoming = cases
    .filter((c) => c.nextHearing && daysUntil(c.nextHearing) >= 0)
    .sort((a, b) => new Date(a.nextHearing) - new Date(b.nextHearing))
    .slice(0, 6);

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-sub">
        A running view of every open matter and what's coming up next.
      </p>

      <div className="stat-row">
        <div className="stat">
          <div className="stat-num">{cases.length}</div>
          <div className="stat-label">Total cases</div>
        </div>
        <div className="stat">
          <div className="stat-num">{active}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat">
          <div className="stat-num">{pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat">
          <div className="stat-num">{closed}</div>
          <div className="stat-label">Closed</div>
        </div>
      </div>

      <p className="section-label">UPCOMING HEARINGS</p>

      {upcoming.length === 0 ? (
        <div className="empty">
          No hearings scheduled yet.{" "}
          <Link href="/cases/new">Add a case</Link> with a next-hearing date
          to see it here.
        </div>
      ) : (
        <div className="register">
          {upcoming.map((c, i) => {
            const d = daysUntil(c.nextHearing);
            return (
              <Link
                href={`/cases/${c.id}`}
                key={c.id}
                className="register-row"
              >
                <div className="register-index">{String(i + 1).padStart(2, "0")}</div>
                <div className="register-main">
                  <p className="case-title">{c.title}</p>
                  <p className="case-meta">
                    {c.caseNumber || "No case number"} · {c.court || "Court not set"}
                  </p>
                </div>
                <span className={`pill ${pillClassFor(c.status)}`}>{c.status}</span>
                <div className="register-hearing">
                  <div className="date">{c.nextHearing}</div>
                  <div>{d === 0 ? "Today" : d === 1 ? "Tomorrow" : `In ${d} days`}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
