import type {
  Message,
  MessageInput,
  Provider,
  ProviderRegistration,
  Review,
  ReviewInput,
  SearchResult,
  UserContext,
} from "./types";

function ctxParams(ctx: UserContext): URLSearchParams {
  const p = new URLSearchParams();
  if (ctx.point) {
    p.set("lat", String(ctx.point.lat));
    p.set("lng", String(ctx.point.lng));
  }
  if (ctx.city) p.set("city", ctx.city);
  if (ctx.country) p.set("country", ctx.country);
  if (ctx.currency) p.set("currency", ctx.currency);
  if (ctx.locale) p.set("locale", ctx.locale);
  return p;
}

export async function searchProviders(opts: {
  q?: string;
  category?: string;
  ctx: UserContext;
  limit?: number;
  signal?: AbortSignal;
}): Promise<SearchResult[]> {
  const p = ctxParams(opts.ctx);
  if (opts.q) p.set("q", opts.q);
  if (opts.category) p.set("category", opts.category);
  if (opts.limit) p.set("limit", String(opts.limit));
  const res = await fetch(`/api/providers?${p.toString()}`, {
    signal: opts.signal,
  });
  if (!res.ok) throw new Error("Search failed");
  const data = (await res.json()) as { results: SearchResult[] };
  return data.results;
}

export async function fetchProvider(
  id: string,
  ctx: UserContext,
  signal?: AbortSignal,
): Promise<Provider | null> {
  const res = await fetch(`/api/providers/${id}?${ctxParams(ctx).toString()}`, {
    signal,
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load provider");
  const data = (await res.json()) as { provider: Provider };
  return data.provider;
}

export async function submitReview(
  providerId: string,
  input: ReviewInput,
  ctx: UserContext,
): Promise<Review> {
  const res = await fetch(`/api/providers/${providerId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, ctx }),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Could not post your review");
  }
  const data = (await res.json()) as { review: Review };
  return data.review;
}

export async function fetchStats(): Promise<{ providers: number; reviews: number; categories: number }> {
  try {
    const res = await fetch(`/api/stats`);
    if (!res.ok) return { providers: 0, reviews: 0, categories: 0 };
    return (await res.json()) as { providers: number; reviews: number; categories: number };
  } catch {
    return { providers: 0, reviews: 0, categories: 0 };
  }
}

export async function sendMessage(providerId: string, input: MessageInput): Promise<void> {
  const res = await fetch(`/api/providers/${providerId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Could not send your message");
  }
}

export async function fetchInbox(
  owned: { id: string; token: string }[],
  markRead = false,
): Promise<{ messages: Message[]; unread: number }> {
  if (owned.length === 0) return { messages: [], unread: 0 };
  const res = await fetch(`/api/inbox`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ owned, markRead }),
  });
  if (!res.ok) return { messages: [], unread: 0 };
  return (await res.json()) as { messages: Message[]; unread: number };
}

export async function registerProvider(
  input: ProviderRegistration,
  ctx: UserContext,
): Promise<Provider> {
  const res = await fetch(`/api/providers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, ctx }),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Registration failed");
  }
  const data = (await res.json()) as { provider: Provider };
  return data.provider;
}

export async function updateProvider(
  id: string,
  input: ProviderRegistration,
  editToken: string,
  ctx: UserContext,
): Promise<Provider> {
  const res = await fetch(`/api/providers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, editToken, ctx }),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Could not save changes");
  }
  const data = (await res.json()) as { provider: Provider };
  return data.provider;
}

export async function deleteProvider(id: string, editToken: string): Promise<void> {
  const res = await fetch(`/api/providers/${id}`, {
    method: "DELETE",
    headers: { "x-edit-token": editToken },
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Could not delete listing");
  }
}

/** Start a Pro upgrade — returns the Paystack checkout URL to redirect to. */
export async function startUpgrade(id: string, email: string): Promise<string> {
  const res = await fetch(`/api/providers/${id}/upgrade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    authorizationUrl?: string;
    error?: string;
  };
  if (!res.ok || !data.authorizationUrl) {
    throw new Error(data.error ?? "Could not start the upgrade");
  }
  return data.authorizationUrl;
}
