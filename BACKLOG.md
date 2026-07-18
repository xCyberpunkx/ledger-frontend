# Ledger — Backlog

Format: `[ ] TICKET-ID — title (branch name)`
Move tickets to DONE with the PR link when merged. This file IS the
project board until/unless you wire up a real one — keep it honest.

## V1 — Auth (Clerk) & Organization Core

- [x] AUTH-01 — Frontend: ClerkProvider, middleware route protection, sign-in/sign-up pages (`feature/clerk-frontend`)
- [x] AUTH-02 — Backend: ClerkAuthGuard verifying session JWTs (`feature/clerk-guard`)
- [x] AUTH-03 — Backend: Clerk webhook (user.created/updated/deleted) syncing local User table (`feature/clerk-webhook`)
      AC: guard self-heals via clerkClient.users.getUser() if webhook hasn't landed yet.
- [ ] ORG-01 — Create organization (creator = OWNER membership) (`feature/org-create`)
- [ ] ORG-02 — Invite team member by email (`feature/org-invite`)
      AC: invite creates a pending Membership; accepting requires signing in with that email via Clerk.
- [ ] ORG-03 — OrgRoleGuard + `@Roles()` decorator (`feature/org-role-guard`)
      AC: guard reads role from Membership scoped to :organizationId param, not from the Clerk JWT alone — Clerk knows who you are, not what you're allowed to do in this org.
- [ ] ORG-04 — Frontend: org switcher + protected routes (`feature/org-frontend`)
- [ ] TEST-01 — Cross-org isolation test suite (`test/tenant-isolation-v1`)
      AC: User A (Org 1, ADMIN) hits Org 2's membership list endpoint → 403, not empty array (empty array leaks existence).

## V2 — Clients & Projects

- [ ] CLIENT-01 — Client CRUD (`feature/client-crud`)
- [ ] PROJECT-01 — Project CRUD, belongs to Org + Client (`feature/project-crud`)
- [ ] PROJECT-02 — ProjectAssignment endpoints (`feature/project-assignment`)
- [ ] PROJECT-03 — Scoped project list (Owner/Admin: all, Member: assigned only) (`feature/project-scoping`)
- [ ] TEST-02 — Team member cannot access unassigned project (404, not 403 — don't confirm it exists) (`test/project-scoping`)

## V3 — Tasks & Milestones

- [ ] MILESTONE-01 — Milestone CRUD (`feature/milestone-crud`)
- [ ] TASK-01 — Task CRUD + status/priority enums (`feature/task-crud`)
- [ ] TASK-02 — Kanban view (drag-drop status update) (`feature/task-kanban`)
- [ ] TASK-03 — List view + filters (assignee, status, priority, due date) (`feature/task-list`)
- [ ] TASK-04 — Assignee must be a Membership assigned to that project (validated server-side, not just UI) (`feature/task-assignee-validation`)

## V4 — Files & Comments

- [ ] FILE-01 — Cloudinary upload signed endpoint (`feature/file-upload`)
- [ ] FILE-02 — FileAsset scoping (only project members + that project's client can list/download) (`feature/file-scoping`)
- [ ] COMMENT-01 — Comment on Task/FileAsset/Project (`feature/comment-polymorphic`)

## V5 — Activity & Notifications

- [ ] ACTIVITY-01 — ActivityEvent emission from task/file/comment actions (`feature/activity-events`)
- [ ] ACTIVITY-02 — Timeline UI (`feature/activity-timeline`)
- [ ] NOTIFY-01 — Email notification dispatch off ActivityEvent (`feature/notifications`)
      AC: notification content built from the event, not duplicated logic.

## V6 — Dashboard & Search

- [ ] DASH-01 — Project health calculation (overdue tasks + staleness) (`feature/dashboard-health`)
- [ ] SEARCH-01 — Indexed backend search across tasks/projects (`feature/search`)

## V7 — Client Portal

- [ ] PORTAL-01 — ClientPortalInvite token flow (`feature/portal-invite`)
- [ ] PORTAL-02 — Client-facing scoped UI (`feature/portal-ui`)
- [ ] TEST-03 — Client cannot see internal tasks / other clients / other projects (`test/portal-isolation`)

## V8 — Production Polish

- [ ] POLISH-01 — Dark mode
- [ ] POLISH-02 — Responsive audit
- [ ] OBS-01 — Sentry + structured logging + global exception filter
- [ ] E2E-01 — Playwright: signup→org→project flow
- [ ] E2E-02 — Playwright: task lifecycle
- [ ] E2E-03 — Playwright: client portal flow
- [ ] DEPLOY-01 — Vercel + Railway/Render + Neon + custom domain + CI/CD gate
- [ ] DOCS-01 — README, API docs, screenshots, demo video
