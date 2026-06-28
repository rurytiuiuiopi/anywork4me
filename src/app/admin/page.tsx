"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getCategory } from "@/lib/categories";
import type { AdminStats } from "@/lib/types";

const COLORS = ["#4f46e5", "#14b8a6", "#ec4899", "#a855f7", "#f59e0b", "#94a3b8"];

type ViewKey =
  | "overview"
  | "listings"
  | "categories"
  | "reviews"
  | "revenue"
  | "messages"
  | "settings";

const NAV: { key: ViewKey; label: string; icon: string; soon?: boolean }[] = [
  { key: "overview", label: "Dashboard", icon: "▦" },
  { key: "listings", label: "Listings", icon: "📋" },
  { key: "categories", label: "Categories", icon: "🏷️" },
  { key: "reviews", label: "Reviews", icon: "⭐" },
  { key: "revenue", label: "Pro & Revenue", icon: "💳", soon: true },
  { key: "messages", label: "Messages", icon: "💬", soon: true },
  { key: "settings", label: "Settings", icon: "⚙️" },
];

const HEADERS: Record<ViewKey, string> = {
  overview: "Here’s what’s happening on anywork4me.",
  listings: "View and manage every listing.",
  categories: "What people are offering.",
  reviews: "Ratings across your listings.",
  revenue: "Pro subscriptions & earnings.",
  messages: "Conversations with customers.",
  settings: "Security and admin controls.",
};

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [secured, setSecured] = useState(true);
  const [serviceKey, setServiceKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewKey>("overview");

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
      setServiceKey(!!data.serviceKey);
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

  async function del(id: string, label: string) {
    if (!window.confirm(`Delete "${label}"? This permanently removes the listing.`)) return;
    const res = await fetch(`/api/admin/providers/${id}`, { method: "DELETE" });
    if (res.ok) {
      load();
    } else {
      const d = (await res.json().catch(() => ({}))) as { error?: string };
      window.alert(d.error || "Couldn’t delete that listing.");
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

  const active = NAV.find((n) => n.key === view) ?? NAV[0];

  return (
    <div className="flex min-h-dvh bg-surface">
      {/* Sidebar (desktop) */}
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
            <NavButton key={n.key} item={n} active={view === n.key} onClick={() => setView(n.key)} />
          ))}
          <Link
            href="/"
            className="mt-1 flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-surface"
          >
            <span className="w-5 text-center">↩</span> Back to site
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1">
        {/* Mobile top bar + nav */}
        <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-base font-semibold tracking-tight">
              anywork<span className="text-accent">4me</span>
            </span>
            <Link href="/" className="text-sm font-medium text-muted">
              View site ↗
            </Link>
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
            {NAV.map((n) => (
              <button
                key={n.key}
                type="button"
                onClick={() => setView(n.key)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                  view === n.key
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-surface-2 text-muted"
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-8">
          {loading || !stats ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="fm-skeleton h-24 rounded-3xl" />
              ))}
            </div>
          ) : (
            <>
              <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{active.label}</h1>
                  <p className="mt-1 text-muted">{HEADERS[view]}</p>
                </div>
                <Link
                  href="/available"
                  className="brand-gradient rounded-2xl px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm"
                >
                  + Add a listing
                </Link>
              </header>

              {view === "overview" && (
                <Overview stats={stats} secured={secured} del={del} onSeeAll={() => setView("listings")} />
              )}
              {view === "listings" && <Listings stats={stats} serviceKey={serviceKey} del={del} />}
              {view === "categories" && <Categories stats={stats} />}
              {view === "reviews" && <Reviews stats={stats} />}
              {view === "settings" && <Settings secured={secured} serviceKey={serviceKey} />}
              {(view === "revenue" || view === "messages") && <ComingSoon title={active.label} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function NavButton({
  item,
  active,
  onClick,
}: {
  item: { label: string; icon: string; soon?: boolean };
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition ${
        active ? "bg-accent/10 text-accent" : "text-muted hover:bg-surface"
      }`}
    >
      <span className="w-5 text-center">{item.icon}</span>
      <span className="flex-1">{item.label}</span>
      {item.soon && (
        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-muted">soon</span>
      )}
    </button>
  );
}

function StatCards({ stats }: { stats: AdminStats }) {
  const newThisWeek = stats.signupsByDay.slice(-7).reduce((s, d) => s + d.count, 0);
  const cards: { icon: string; label: string; value: number; sub?: string }[] = [
    { icon: "📋", label: "Total listings", value: stats.totalListings, sub: `${newThisWeek} new this week` },
    { icon: "🟢", label: "Available now", value: stats.availableNow },
    { icon: "🏷️", label: "Categories used", value: stats.categoriesUsed },
    { icon: "⭐", label: "Total reviews", value: stats.totalReviews },
    { icon: "💳", label: "Pro subscribers", value: stats.proSubscribers },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
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
  );
}

function Overview({
  stats,
  secured,
  del,
  onSeeAll,
}: {
  stats: AdminStats;
  secured: boolean;
  del: (id: string, label: string) => void;
  onSeeAll: () => void;
}) {
  return (
    <>
      {!secured && (
        <div className="mb-5 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
          ⚠️ This dashboard is <strong>not protected</strong>. Set <code>ADMIN_PASSWORD</code> in
          Vercel and redeploy to lock it.
        </div>
      )}

      <StatCards stats={stats} />

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <section className="rounded-3xl border border-border bg-background p-5 lg:col-span-2">
          <h2 className="font-semibold">New listings · last 14 days</h2>
          <SignupChart data={stats.signupsByDay} />
        </section>

        <section className="rounded-3xl border border-border bg-background p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent</h2>
            <button onClick={onSeeAll} className="text-sm font-semibold text-accent">
              See all
            </button>
          </div>
          {stats.recent.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No listings yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {stats.recent.slice(0, 6).map((r) => (
                <ListingRow key={r.id} r={r} del={del} />
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <section className="rounded-3xl border border-border bg-background p-5">
          <h2 className="font-semibold">Top categories</h2>
          <TopCategories data={stats.topCategories} total={stats.totalListings} />
        </section>

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

function Listings({
  stats,
  serviceKey,
  del,
}: {
  stats: AdminStats;
  serviceKey: boolean;
  del: (id: string, label: string) => void;
}) {
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const rows = term
    ? stats.recent.filter((r) =>
        `${r.business ?? ""} ${r.name} ${r.city} ${getCategory(r.categoryId)?.name ?? ""}`
          .toLowerCase()
          .includes(term),
      )
    : stats.recent;

  return (
    <>
      {!serviceKey && (
        <div className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
          🗑 Delete buttons need the service key. Turn it on in <strong>Settings</strong> to manage
          listings here.
        </div>
      )}
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search listings…"
        className="mb-4 h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none focus:border-accent"
      />
      <section className="rounded-3xl border border-border bg-background p-3 sm:p-5">
        {rows.length === 0 ? (
          <p className="px-2 py-8 text-center text-sm text-muted">
            {term ? "No listings match your search." : "No listings yet."}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.id} className="py-2 first:pt-0 last:pb-0">
                <ListingRow r={r} del={del} showStatus />
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="mt-3 text-xs text-muted">
        Showing {rows.length} of {stats.totalListings} listing{stats.totalListings === 1 ? "" : "s"}.
      </p>
    </>
  );
}

function ListingRow({
  r,
  del,
  showStatus,
}: {
  r: AdminStats["recent"][number];
  del: (id: string, label: string) => void;
  showStatus?: boolean;
}) {
  const cat = getCategory(r.categoryId);
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/provider/${r.id}`}
        className="flex min-w-0 flex-1 items-center gap-3 py-1.5 transition hover:opacity-80"
      >
        <span className="brand-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-accent-foreground">
          {cat?.emoji ?? "•"}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{r.business || r.name}</span>
          <span className="block truncate text-xs text-muted">
            {cat?.name ?? r.categoryId} · {r.city}
          </span>
        </span>
      </Link>
      {showStatus && (
        <span
          className={`hidden shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium sm:inline ${
            r.availability === "available"
              ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300"
              : "bg-surface-2 text-muted"
          }`}
        >
          {r.availability === "available" ? "Available" : r.availability}
        </span>
      )}
      <button
        type="button"
        onClick={() => del(r.id, r.business || r.name)}
        aria-label="Delete listing"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
      >
        🗑
      </button>
    </div>
  );
}

function Categories({ stats }: { stats: AdminStats }) {
  return (
    <section className="rounded-3xl border border-border bg-background p-5 sm:p-6">
      {stats.topCategories.length === 0 ? (
        <p className="text-sm text-muted">No categories in use yet.</p>
      ) : (
        <>
          <TopCategories data={stats.topCategories} total={stats.totalListings} />
          <ul className="mt-6 divide-y divide-border border-t border-border">
            {stats.topCategories.map((c) => {
              const cat = getCategory(c.id);
              return (
                <li key={c.id} className="flex items-center justify-between py-3">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <span>{cat?.emoji ?? "🏷️"}</span> {cat?.name ?? c.id}
                  </span>
                  <span className="text-sm text-muted">
                    {c.count} listing{c.count === 1 ? "" : "s"}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}

function Reviews({ stats }: { stats: AdminStats }) {
  return (
    <section className="rounded-3xl border border-border bg-background p-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-2xl">
        ⭐
      </div>
      <p className="mt-4 text-3xl font-semibold">{stats.totalReviews.toLocaleString()}</p>
      <p className="text-muted">total reviews across your listings</p>
      <p className="mx-auto mt-4 max-w-sm text-sm text-muted">
        Customers rate providers from each profile. Per-review moderation is coming next — for now,
        open any listing to read its reviews.
      </p>
    </section>
  );
}

function Settings({ secured, serviceKey }: { secured: boolean; serviceKey: boolean }) {
  return (
    <div className="space-y-4">
      <SettingRow
        title="Dashboard lock"
        ok={secured}
        okText="Locked — password protected"
        offText="Open — anyone with the link can view"
        help={
          secured ? undefined : (
            <>
              Add <code>ADMIN_PASSWORD</code> in Vercel and redeploy.
            </>
          )
        }
      />
      <SettingRow
        title="Admin actions (delete) & Pro payments"
        ok={serviceKey}
        okText="Enabled — you can delete listings"
        offText="Off — delete buttons are disabled"
        help={
          serviceKey ? undefined : (
            <>
              Add <code>SUPABASE_SERVICE_ROLE_KEY</code> in Vercel and redeploy to turn this on.
            </>
          )
        }
      />
      <div className="rounded-3xl border border-border bg-background p-5">
        <h2 className="font-semibold">Manage</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <a
            href="https://vercel.com/dgc-mcc/findme/settings/environment-variables"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm font-medium transition hover:bg-surface"
          >
            Environment variables ↗
          </a>
          <Link
            href="/"
            className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm font-medium transition hover:bg-surface"
          >
            View live site ›
          </Link>
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  title,
  ok,
  okText,
  offText,
  help,
}: {
  title: string;
  ok: boolean;
  okText: string;
  offText: string;
  help?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-background p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">{title}</h2>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            ok
              ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300"
              : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
          }`}
        >
          {ok ? "On" : "Off"}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted">{ok ? okText : offText}</p>
      {help && <p className="mt-1 text-sm text-muted">{help}</p>}
    </div>
  );
}

function ComingSoon({ title }: { title: string }) {
  return (
    <section className="rounded-3xl border border-dashed border-border bg-background p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-2xl">
        🚧
      </div>
      <h2 className="mt-4 text-lg font-semibold">{title} is coming soon</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
        This section lights up as the marketplace grows. Your listings, categories, and reviews are
        live right now.
      </p>
    </section>
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
