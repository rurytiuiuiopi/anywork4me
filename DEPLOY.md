# Going live — anywork4me

Three stages: **database → deploy → domain**. ~30 minutes total.

---

## 1. Database (Supabase — free)

1. Create a project at [supabase.com](https://supabase.com) (pick a region near most users).
2. Open **SQL Editor**, paste the contents of [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql), and **Run**.
3. Go to **Settings → API** and copy three values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **secret — server only**

### Test it locally

```bash
cp .env.example .env.local      # then paste your three values in
npm run dev
```

Open <http://localhost:3000>, go to **"I'm Available"**, register — then search that
category. The provider now persists in your real database (refresh-proof).

---

## 2. Deploy (Vercel)

**Option A — GitHub (recommended, gives auto-deploys on every push):**

1. Push this folder to a new GitHub repo.
2. At [vercel.com/new](https://vercel.com/new), **Import** the repo. Vercel detects Next.js.
3. Add the **Environment Variables** (the four from `.env.local`) under the project settings.
4. **Deploy.** You get a live `*.vercel.app` URL in ~2 minutes.

**Option B — CLI:**

```bash
npx vercel            # log in + link the project (one-time)
npx vercel --prod     # deploy to production
```

Add the env vars with `npx vercel env add` or in the dashboard.

---

## 3. Your domain

1. In Vercel: **Project → Settings → Domains → Add**, enter your domain.
2. Vercel shows the DNS records to create. Typically:
   - Apex (`yourdomain.com`): an **A record** → Vercel's IP, **or** an `ALIAS`/`ANAME`.
   - `www`: a **CNAME** → `cname.vercel-dns.com`.
3. Add those records at your domain registrar (GoDaddy / Namecheap / Cloudflare / etc.).
4. Wait for DNS to propagate (minutes to a couple of hours). Vercel auto-issues HTTPS.

Done — anywork4me is live on your domain. 🎉

---

## Switching backends

`NEXT_PUBLIC_DATA_BACKEND=mock` → in-memory demo · `=supabase` → real database.
Everything else stays the same; the app talks to one `ProviderRepository` interface.
