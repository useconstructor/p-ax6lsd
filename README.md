# Cocina mexicana — negocio de ejemplo

Next.js 16 App Router, Tailwind 4, local fonts and illustrative photographs, shadcn UI controls, and Turso persistence.

Run `npm install`, `npm run dev`; production verification: `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm start`.

Server runtime environment: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`. The Turso client is created lazily on the first data request, so production builds do not require database credentials. Missing runtime credentials never trigger a substitute database. Optional `ALLOWED_ORIGINS` is a comma separated list of additional trusted application origins. `NEXT_PUBLIC_SITE_URL`, `VERCEL_URL` and `VERCEL_PROJECT_PRODUCTION_URL` are accepted when supplied; the application request origin is accepted. When a local reverse proxy changes that origin, explicitly include the browser origin in `ALLOWED_ORIGINS`. No wildcard CORS. Credentials are used only in server modules.

Anonymous deployed sessions use Secure, HttpOnly, Partitioned, SameSite=None cookies. Production requires HTTPS. HTTP loopback only uses HttpOnly, SameSite=Lax cookies for local verification; loopback aliases on the server port are explicitly allowed for Origin validation. The order page establishes and verifies its session before enabling submission. Embedded hosting must allow scripts and same origin cookies for the application.

Catalog seeding uses a persistent initialization marker in a write transaction. Availability is generated idempotently for today and six subsequent UTC days: illustrative 12:00 to 15:00 windows, thirty minute slots, five orders per slot. Historical rows remain intact. All confirmed orders are persisted atomically and protected by idempotency and transaction serialized capacity checks. Drafts exist only in shared React state during internal navigation.

`ASSET-LICENSES.md` records photo and font provenance. Current reproducible QA and screenshots are stored outside shipped source at `/tmp/constructor-quality`. Run `node /tmp/constructor-quality/verify-interactions.cjs` against the production app on http://127.0.0.1:3100. It also exports `verify({browser,baseUrl,evidenceDir})` for the independent runner. Actual Constructor cross site HTTPS iframe acceptance remains pending.

Verification on 2026-10-12: production build both with and without Turso build credentials, ESLint and TypeScript passed. Browser journey, errors, quantity preservation, reload and responsive overflow checks passed at 1440, 768 and 390 pixels. Turso tests passed input validation, unavailable dish rejection, anonymous session isolation, idempotent replay and six concurrent submissions with exactly five accepted. A cross site HTTPS iframe harness passed creation and session recovery. Explicitly labelled QA orders remain stored; no historical data was deleted. Screenshots and test evidence are outside the shipped code at `/tmp/app-evidence`. Actual Constructor host acceptance remains an independent pending check.
