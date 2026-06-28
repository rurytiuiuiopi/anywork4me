// Best-effort, in-memory rate limiter for public mutation endpoints.
//
// NOTE: serverless instances do NOT share memory, so this catches bursts on a
// warm instance but is not globally distributed. For production-grade limits,
// back this with Vercel KV / Upstash Redis (same interface). It still meaningfully
// raises the cost of scripted abuse and protects a single hot instance.

const hits = new Map<string, number[]>();

/** Returns true if the request is allowed, false if it should be rate-limited. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t > windowMs)) hits.delete(k);
  }
  return true;
}

/** Derive a per-client key from the request IP + a scope label. */
export function clientKey(req: Request, scope: string): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  return `${scope}:${ip}`;
}
