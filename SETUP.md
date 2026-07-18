# Setup — From Zero

## Prerequisites (install once)
- Node.js 20 LTS — https://nodejs.org (check: `node -v`)
- Docker Desktop — https://docker.com (check: `docker -v`)
- Git
- A code editor (VS Code recommended, with the Prisma extension)

## 1. Get the two repos onto your machine
You'll get `ledger-backend/` and `ledger-frontend/` as downloads from this
chat. Turn each into its own git repo:

```bash
cd ledger-backend && git init && git add -A && git commit -m "chore: V0 foundation"
cd ../ledger-frontend && git init && git add -A && git commit -m "chore: V0 foundation"
```

Then create two empty repos on GitHub (`ledger-backend`, `ledger-frontend`)
and push each.

## 2. Backend — install & run

```bash
cd ledger-backend
npm install
cp .env.example .env          # fill in real secrets later; defaults work for local dev
docker compose up -d          # starts Postgres on localhost:5432
npx prisma migrate dev --name init   # creates tables from schema.prisma
npm run start:dev             # NestJS on http://localhost:4000
```

Confirm it's alive:
```bash
curl http://localhost:4000/api/v1/health
# {"status":"ok","timestamp":"..."}
```

Useful backend commands you'll use constantly:
- `npx prisma studio` — GUI to browse/edit your local DB
- `npx prisma migrate dev --name <name>` — after any schema.prisma change
- `npm run lint` — fix style issues before committing

## 3. Frontend — install & run

```bash
cd ledger-frontend
npm install
cp .env.example .env.local
npm run dev                   # Next.js on http://localhost:3000
```

## 4. Shadcn UI (add components as you need them, not all upfront)
```bash
npx shadcn@latest init
npx shadcn@latest add button input card   # example — add per feature
```

## Daily workflow once both are running
1. `docker compose up -d` (backend repo) — Postgres
2. `npm run start:dev` (backend repo) — API on :4000
3. `npm run dev` (frontend repo) — UI on :3000
4. Work on a feature branch (see BACKLOG.md for the ticket + branch name)
5. Commit with conventional commit format (see Git Rules in CONTEXT.md)
6. Open a PR — CI runs lint + build automatically
