import type {
  AdminStats,
  Category,
  Provider,
  ProviderRegistration,
  Review,
  ReviewInput,
  SearchQuery,
  SearchResult,
  UserContext,
} from "../types";

/**
 * The single seam between the app and its data source.
 *
 * Phase 1 ships an in-memory mock implementation. Swapping to Supabase/Postgres
 * later means writing one more class against this interface and changing the
 * selector in ./index.ts — no UI or API route changes.
 */
export interface ProviderRepository {
  search(query: SearchQuery, ctx: UserContext): Promise<SearchResult[]>;
  getById(id: string, ctx: UserContext): Promise<Provider | null>;
  register(input: ProviderRegistration, ctx: UserContext): Promise<Provider>;
  /** Owner-only edit, authorized by the listing's secret edit token. */
  update(
    id: string,
    input: ProviderRegistration,
    editToken: string,
    ctx: UserContext,
  ): Promise<Provider>;
  /** Owner-only delete, authorized by the listing's secret edit token. */
  remove(id: string, editToken: string, ctx: UserContext): Promise<void>;
  /** Server-only: grant/extend Pro after a verified payment (trusted call). */
  setProUntil(id: string, untilISO: string): Promise<void>;
  /** Aggregated numbers for the private owner dashboard. */
  adminStats(): Promise<AdminStats>;
  addReview(providerId: string, input: ReviewInput, ctx: UserContext): Promise<Review>;
  listCategories(ctx: UserContext): Promise<Category[]>;
}
