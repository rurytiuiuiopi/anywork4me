import { dataBackend } from "../config";
import type { ProviderRepository } from "./repository";
import { MockProviderRepository } from "./mock-repository";
import { SupabaseProviderRepository } from "./supabase/supabase-repository";

export type { ProviderRepository } from "./repository";

// Single repository instance per server process. A module-level singleton (kept
// on globalThis so it survives dev hot-reloads) lets live registrations persist
// across requests during a session.
declare global {
  // eslint-disable-next-line no-var
  var __fmRepo: ProviderRepository | undefined;
}

function create(): ProviderRepository {
  switch (dataBackend) {
    case "supabase":
      return new SupabaseProviderRepository();
    case "mock":
    default:
      return new MockProviderRepository();
  }
}

export const repository: ProviderRepository =
  globalThis.__fmRepo ?? (globalThis.__fmRepo = create());
