# Deployment (do this properly in V8, but CI starts from V0)

## CI (GitHub Actions) — set up now, in both repos
`.github/workflows/ci.yml` — lint + build on every PR, before you ever
deploy anything. Catching a broken build on a PR is free; catching it in
prod isn't.

## Database — Neon (Postgres)
1. Create a Neon project → copy the pooled connection string.
2. That becomes `DATABASE_URL` in your backend's production env.
3. Run `npx prisma migrate deploy` (not `migrate dev`) as part of your
   deploy step — `deploy` applies existing migrations without prompting
   or generating new ones, which is what you want in CI/CD.

## Backend — Railway or Render
- Connect the `ledger-backend` GitHub repo.
- Build command: `npm install && npx prisma generate && npm run build`
- Start command: `npm run start:prod`
- Env vars: everything from `.env.example`, with real values + Neon's
  `DATABASE_URL` + your production `FRONTEND_URL` (for CORS).
- Health check path: `/api/v1/health` — both platforms can poll this to
  know a deploy is actually healthy, not just "the process started."

## Frontend — Vercel
- Import `ledger-frontend` repo.
- Env var: `NEXT_PUBLIC_API_URL` = your Railway/Render backend URL + `/api/v1`.
- Vercel auto-deploys on push to main, preview deploys on PRs — this is
  free and you should use PR previews to sanity-check UI changes.

## Custom domain
- Buy one (Namecheap/Porkbun, doesn't need to be fancy) → point it at
  Vercel for the frontend (`app.yourdomain.com`) and optionally a
  subdomain at Railway/Render for the API (`api.yourdomain.com`).

## Monitoring — Sentry
- One free project per repo (frontend + backend).
- Backend: `@sentry/node`, wired into the global exception filter.
- Frontend: `@sentry/nextjs` — its own setup wizard handles most of this.

## Showcase checklist (V8, before you call it done)
- [ ] Live URL, custom domain
- [ ] README with: problem statement, architecture diagram, tech stack,
      screenshots (dashboard, kanban, client portal), how to run locally
- [ ] Seeded demo account credentials in the README (read-only demo org)
      so a recruiter can log in without you setting anything up for them
- [ ] 2-3 minute demo video: problem → solution → walk through the 3
      personas (owner, team member, client) → one deliberate "watch it
      deny access" moment, since that's your actual differentiator
- [ ] API docs (Swagger/OpenAPI via `@nestjs/swagger`, or a Postman
      collection export)
