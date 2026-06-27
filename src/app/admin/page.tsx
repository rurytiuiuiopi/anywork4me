"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getCategory } from "@/lib/categories";
import type { AdminStats } from "@/lib/types";

const COLORS = ["#4f46e5", "#14b8a6", "#ec4899", "#a855f7", "#f59e0b", "#94a3b8"];

const NAV: { label: string; icon: string; active?: boolean; soon?: boolean }[] = [
  { label: "Dashboard", icon: "▦", active: true },
  { label: "Listings", icon: "👤", soon: true },
  { label: "Categories", icon: "🏷️", soon: true },
  { label: "Reviews", icon: "⭐", soon: true },
  { label: "Pro & Revenue", icon: "💳", soon: true },
  { label: "Messages", icon: "💬", soon: true },
  { label: "Reports", icon: "🚩", soon: true },
  { label: "Settings", icon: "⚙️", soon: true },
];

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [secured, setSecured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.status === 401) {
        setNeedsPassword(true);
        return;
      }
      const data = await res.json();
      setStats(data.stats);
      setSecured(data.secured);
      setNeedsPassword(false);
    } catch {
      setError("Couldn’t load the dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function login() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Wrong password.");
        return;
      }
      await load();
    } catch {
      setError("Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (needsPassword) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-5">
        <div className="w-full max-w-sm rounded-3xl border border-border bg-background p-6 text-center shadow-sm">
          <div className="brand-gradient mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-accent-foreground">
            🔒
          </div>
          <h1 className="mt-4 text-xl font-semibold">Owner dashboard</h1>
          <p className="mt-1 text-sm text-muted">Enter your admin password.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Password"
            className="mt-4 h-12 w-full rounded-2xl border border-border bg-surface-2 px-4 outline-none focus:border-accent"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button
            onClick={login}
            disabled={busy}
            className="brand-gradient mt-4 h-12 w-full rounded-2xl font-semibold text-accent-foreground disabled:opacity-50"
          >
            {busy ? "Checking…" : "Enter"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-dvh bg-surface">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-background p-4 md:flex">
        <div className="flex items-center gap-2 px-2 py-3">
          <span className="brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-accent-foreground">
            ◎
          </span>
          <span className="text-lg font-semibold tracking-tight">
            anywork<span className="text-accent">4me</span>
          </span>
        </div>
        <nav className="mt-4 flex-1 space-y-1">
          {NAV.map((n) => (
            <div
              key={n.label}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium ${
                n.active ? "bg-accent/10 text-accent" : "text-muted"
              }`}
            >
              <span className="w-5 text-center">{n.icon}</span>
              <span className="flex-1">{n.label}</span>
              {n.soon && (
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-muted">soon</span>
              )}
            </div>
          ))}
          <Link
            href="/"
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-surface"
          >
            <span className="w-5 text-center">↩</span> Back to site
          </Link>
        </nav>
        <div className="mt-auto flex items-center gap-3 rounded-2xl border border-border p-3">
          <span className="brand-gradient flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-accent-foreground">
            A
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Owner</p>
            <p className="truncate text-xs text-muted">anywork4me admin</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1 p-5 sm:p-8">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-muted">Here’s what’s happening on anywork4me.</p>
          </div>
          <Link
            href="/available"
            className="brand-gradient rounded-2xl px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm"
          >
            + Add a listing
          </Link>
        </header>

        {!secured && (
          <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
            ⚠️ This dashboard is <strong>not protected</strong>. Set <code>ADMIN_PASSWORD</code> in
            your hosting env (Vercel) and redeploy to lock it to just you.
          </div>
        )}

        {loading || !stats ? (
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="fm-skeleton h-24 rounded-3xl" />
            ))}
          </div>
        ) : (
          <Dashboard stats={stats} />
        )}
      </main>
    </div>
  );
}

function Dashboard({ stats }: { stats: AdminStats }) {
  const newThisWeek = stats.signupsByDay.slice(-7).reduce((s, d) => s + d.count, 0);
  const cards: { icon: string; label: string; value: number; sub?: string }[] = [
    { icon: "📋", label: "Total listings", value: stats.totalListings, sub: `${newThisWeek} new this week` },
    { icon: "🟢", label: "Available now", value: stats.availableNow },
    { icon: "🏷️", label: "Categories used", value: stats.categoriesUsed },
    { icon: "⭐", label: "Total reviews", value: stats.totalReviews },
    { icon: "💳", label: "Pro subscribers", value: stats.proSubscribers },
  ];

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-3xl border border-border bg-background p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-xl">
                {c.icon}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm text-muted">{c.label}</p>
                <p className="text-2xl font-semibold">{c.value.toLocaleString()}</p>
              </div>
            </div>
            {c.sub && <p className="mt-2 text-xs text-muted">{c.sub}</p>}
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* Signups chart */}
        <section className="rounded-3xl border border-border bg-background p-5 lg:col-span-2">
          <h2 className="font-semibold">New listings · last 14 days</h2>
          <SignupChart data={stats.signupsByDay} />
        </section>

        {/* Recent listings */}
        <section className="rounded-3xl border border-border bg-background p-5">
          <h2 className="font-semibold">Latest listings</h2>
          {stats.recent.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No listings yet — share your link to get the first ones.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {stats.recent.map((r) => (
                <li key={r.id}>
                  <Link href={`/provider/${r.id}`} className="flex items-center gap-3 transition hover:opacity-80">
                    <span className="brand-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-accent-foreground">
                      {getCategory(r.categoryId)?.emoji ?? "•"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{r.business || r.name}</span>
                      <span className="block truncate text-xs text-muted">
                        {getCategory(r.categoryId)?.name ?? r.categoryId} · {r.city}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* Top categories */}
        <section className="rounded-3xl border border-border bg-background p-5">
          <h2 className="font-semibold">Top categories</h2>
          <TopCategories data={stats.topCategories} total={stats.totalListings} />
        </section>

        {/* Quick actions */}
        <section className="rounded-3xl border border-border bg-background p-5 lg:col-span-2">
          <h2 className="font-semibold">Quick actions</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              { label: "View the live site", href: "/" },
              { label: "Add a listing", href: "/available" },
              { label: "Browse a category", href: "/find/dj" },
              { label: "Recruit testers", href: "/testers" },
            ].map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm font-medium transition hover:bg-surface"
              >
                {a.label} <span className="text-muted">›</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function SignupChart({ data }: { data: AdminStats["signupsByDay"] }) {
  const w = 600;
  const h = 180;
  const pad = 8;
  const max = Math.max(1, ...data.map((d) => d.count));
  const stepX = (w - pad * 2) / Math.max(1, data.length - 1);
  const pts = data.map((d, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (d.count / max) * (h - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${pad},${h - pad} ${line} ${w - pad},${h - pad}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full">
      <defs>
        <linearGradient id="aw4mArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#aw4mArea)" />
      <polyline points={line} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#4f46e5" />
      ))}
    </svg>
  );
}

function TopCategories({
  data,
  total,
}: {
  data: AdminStats["topCategories"];
  total: number;
}) {
  if (!data.length) {
    return <p className="mt-4 text-sm text-muted">No data yet.</p>;
  }
  const sum = data.reduce((s, d) => s + d.count, 0) || 1;
  let acc = 0;
  const stops = data
    .map((d, i) => {
      const start = (acc / sum) * 100;
      acc += d.count;
      const end = (acc / sum) * 100;
      return `${COLORS[i % COLORS.length]} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div className="mt-4 flex items-center gap-5">
      <div className="relative h-32 w-32 shrink-0">
        <div className="h-full w-full rounded-full" style={{ background: `conic-gradient(${stops})` }} />
        <div className="absolute inset-[24%] rounded-full bg-background" />
      </div>
      <ul className="flex-1 space-y-1.5">
        {data.map((d, i) => (
          <li key={d.id} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="flex-1 truncate">{getCategory(d.id)?.name ?? d.id}</span>
            <span className="text-muted">{Math.round((d.count / (total || 1)) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
