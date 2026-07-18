# Testing the API

You'll use three layers. Don't skip to only the last one — manual testing
while building is how you catch bad design before it's baked in.

## 1. Manual, while building — curl or a GUI client

**curl** (fastest, no setup):
```bash
# health check
curl http://localhost:4000/api/v1/health

# once AUTH-01/02 exist:
curl -X POST http://localhost:4000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"Str0ngPass!","name":"Zine"}'

curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"Str0ngPass!"}'
# -> save the accessToken from the response

curl http://localhost:4000/api/v1/organizations \
  -H "Authorization: Bearer <accessToken>"
```

**GUI client (recommended once you're past the first few endpoints):**
Install Insomnia or Postman (or the free/local Bruno, or the VS Code
"Thunder Client" extension). Create a collection `Ledger API` with an
environment variable `{{baseUrl}}` = `http://localhost:4000/api/v1` and
`{{accessToken}}`. Every new endpoint gets a saved request — this becomes
living documentation of your own API as you build.

## 2. Automated integration tests (Nest + Supertest)
Lives in `ledger-backend/test/*.e2e-spec.ts`. These spin up the real Nest
app against a test DB and hit real HTTP endpoints — this is what actually
proves tenant isolation, not unit tests with mocked Prisma.

```bash
npm run test:e2e
```

Example shape you'll write starting in V1:
```ts
it('denies a member of Org A reading Org B membership list', async () => {
  const { accessToken } = await loginAsOrgAMember(app);
  await request(app.getHttpServer())
    .get(`/api/v1/organizations/${orgB.id}/members`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(403);
});
```

## 3. Frontend E2E (Playwright) — from V8, but scaffold earlier if you like
```bash
cd ledger-frontend
npx playwright install
npm run test:e2e
```
These click through the real UI in a real browser — the closest thing to
"does this actually work for a user."

## Rule of thumb
- Writing a new endpoint → curl it once by hand immediately.
- Endpoint touches authorization/tenant boundaries → it gets an e2e-spec
  test before the ticket is considered done. Non-negotiable, per your own
  success criteria in CONTEXT.md.
- Critical user flows (signup, task lifecycle, portal) → Playwright, once
  the UI exists.
