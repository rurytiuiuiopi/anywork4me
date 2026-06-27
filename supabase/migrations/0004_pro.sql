-- Pro subscription support.
-- `pro_until` in the future === the provider is "Pro" (verified + top placement).

alter table public.providers add column if not exists pro_until timestamptz;

-- SECURITY: only the server (service role, after a verified Paystack payment)
-- may set pro_until. Revoking the column from anon/authenticated stops an owner
-- from granting themselves Pro for free via their edit token.
revoke update (pro_until) on public.providers from anon, authenticated;
