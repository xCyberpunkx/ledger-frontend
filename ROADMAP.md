# Ledger — Roadmap

Each version is a coherent, demoable slice. You should be able to run
the app after every version and show someone something real — never a
half-wired feature.

## V0 — Foundation ✅ (this session)
- Two repos scaffolded: `ledger-backend` (NestJS + Prisma), `ledger-frontend` (Next.js App Router)
- Full Prisma schema for the whole domain model (all 11 entities), migrated
- Docker Compose Postgres for local dev
- Health check endpoint (`GET /api/v1/health`) — real DB ping, not decorative
- CI skeleton (lint + build on PR)
- **Demo:** `docker compose up`, backend boots, health check returns 200, frontend renders placeholder page.

## V1 — Auth & Organization Core
- User signup, login, JWT access + refresh tokens, logout (refresh revocation)
- Email verification (Resend)
- Password reset flow
- Organization creation (creator becomes OWNER membership)
- Invite a team member to an org (creates PENDING membership → accepted on signup/login)
- `OrgRoleGuard` — NestJS guard reading role off the Membership, not the User
- Frontend: signup/login pages, protected route middleware, org switcher
- **Tenant isolation test:** User A in Org 1 cannot read Org 2's data even with a valid JWT.
- **Demo:** create an account, create an org, invite a teammate, log in as both.

## V2 — Clients & Projects
- Client CRUD (contact record only, no login yet)
- Project CRUD (belongs to one Org + one Client)
- ProjectAssignment (assign a Membership to a Project)
- Team Member's project list is filtered to assignments only; Owner/Admin sees all
- **Demo:** create a client, create a project under it, assign a teammate, log in as that teammate and confirm they see only that project.

## V3 — Tasks & Milestones
- Milestone CRUD per project
- Task CRUD: kanban view + list view, status, priority, due date, assignee (must be a project-assigned Membership)
- Drag-and-drop status changes (kanban)
- **Demo:** full task board for a project, drag a card across columns, filter by assignee.

## V4 — Files & Comments
- Cloudinary upload wired to FileAsset, scoped to project members + that project's client
- Comment on Task / FileAsset / Project (author = Membership or Client)
- **Demo:** upload a file to a project, comment on it as a team member.

## V5 — Activity Timeline & Notifications
- ActivityEvent emitted from real actions (task completed, file uploaded, comment posted) — one source, not manually logged
- Timeline UI per project, reverse-chronological
- Email notifications (Resend) fired off the same ActivityEvent stream
- **Demo:** complete a task, watch it appear in the timeline instantly and an email land seconds later.

## V6 — Dashboard & Search
- Org dashboard: real health indicators computed from overdue tasks + last activity per project (not fake counters)
- Backend-driven search/filter across tasks and projects, indexed
- **Demo:** dashboard that actually flags a stale/at-risk project.

## V7 — Client Portal
- ClientPortalInvite: token-based invite → acceptance creates portal access
- Client-facing portal UI: scoped to exactly their project(s), read progress/files/milestones, can comment
- Explicit deny tests: client cannot see internal-only tasks, other clients, or anything outside their project
- **Demo:** invite a client, log in as them, confirm the sandboxed view.

## V8 — Production Polish
- Dark mode, full responsive pass
- Sentry (frontend + backend), structured logging, global exception filter
- E2E tests (Playwright) for the 3 critical flows: signup→org→project, task lifecycle, client portal
- Deploy: Vercel (frontend), Railway/Render (backend), Neon (DB), custom domain
- README with screenshots, API docs, demo video, architecture diagram

---

### Ground rule
No version starts until the previous one's tenant-isolation / access-control
tests pass. That's not bureaucracy — it's the thing recruiters will actually
poke at, and it's much cheaper to enforce per-version than to retrofit later.
