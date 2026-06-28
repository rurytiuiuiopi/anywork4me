import type { AdminStats, Provider } from "../types";

// Turn a list of providers + a review count into the dashboard numbers.
// Shared by every repository so the owner dashboard is backend-agnostic.
export function computeAdminStats(providers: Provider[], totalReviews: number): AdminStats {
  const now = Date.now();
  const isPro = (p: Provider) => !!p.proUntil && new Date(p.proUntil).getTime() > now;

  const cats = new Set<string>();
  const catCounts = new Map<string, number>();
  for (const p of providers) {
    for (const c of p.categories) {
      cats.add(c);
      catCounts.set(c, (catCounts.get(c) ?? 0) + 1);
    }
  }

  const topCategories = [...catCounts.entries()]
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const recent = [...providers]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 100)
    .map((p) => ({
      id: p.id,
      name: p.name,
      business: p.business,
      categoryId: p.categories[0],
      city: p.location.city,
      availability: p.availability,
      createdAt: p.createdAt,
    }));

  // Signups per day for the last 14 days.
  const signupsByDay: AdminStats["signupsByDay"] = [];
  const dayIndex = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const key = new Date(now - i * 86_400_000).toISOString().slice(0, 10);
    dayIndex.set(key, signupsByDay.length);
    signupsByDay.push({ date: key, count: 0 });
  }
  for (const p of providers) {
    const idx = dayIndex.get((p.createdAt || "").slice(0, 10));
    if (idx !== undefined) signupsByDay[idx].count++;
  }

  return {
    totalListings: providers.length,
    availableNow: providers.filter((p) => p.availability === "available").length,
    totalReviews,
    proSubscribers: providers.filter(isPro).length,
    categoriesUsed: cats.size,
    recent,
    topCategories,
    signupsByDay,
  };
}
