# FairShift — Decent Work Platform

**Prompt Wars 2026 × SRM ACM Student Chapter · UN SDG 8**  
**One-liner:** Every shift counted, checked against the rules, and signed by both sides.

FairShift is a full-stack hackathon prototype for clearer shift records, pay calculations, safety reporting, worker voice and employer workforce insights. It contains two separate React applications, a Fastify API, a local SQLite database, sector configuration, seeded fictional data and a hash-linked audit ledger.

> **Honesty and safety:** This is a demonstration prototype, not a production labour-compliance product. Data is synthetic. The legal-rule defaults are unverified and must not be treated as legal facts or legal advice. Features marked *Simulated* are not connected to real SMS/WhatsApp, government sources, external payroll, or accredited credential issuers. Do not use it to make employment decisions about real people.

## Run locally

Requirements: Node.js 20+ and npm. The project uses `better-sqlite3`, which may require a compatible prebuilt native binary or build tools on your OS.

1. Extract the ZIP and open the `fairshift` directory in VS Code.
2. Copy `.env.example` to `.env` and set a private `SERVER_SECRET` for your local demo.
3. In the project root run:

```bash
npm install
npm run seed
npm run dev
```

Open the applications:

- Worker PWA: http://localhost:5173
- Employer/admin console: http://localhost:5174
- API health: http://localhost:4000/api/health

To reseed the demo data, stop the dev server and run `npm run reset`. The SQLite database is created at `fairshift.sqlite` in the project root. Do not commit `.env` or a database containing real personal data.

## Project layout

```text
fairshift/
  apps/worker/        React + TypeScript mobile-first worker interface
  apps/admin/         React + TypeScript employer/admin console
  server/src/         Fastify API, SQLite schema and deterministic seed data
  packages/shared/    Shared domain helpers and schemas
  packs/sectors/      Construction and college sector configuration
  docs/               Threat model, ethics, cross-sector plan and demo script
  tests/              Unit tests
```

## Implemented prototype workflows

### Worker interface

- Mobile-first home and language selector (English, Tamil, Hindi and Telugu labels); browser text-to-speech and speech-input fallback when supported.
- Check-in/check-out with sequence checks, a non-extractable browser ECDSA P-256 private key stored in IndexedDB, device signatures, organization countersignatures, and public receipt signature verification. Rotating gate QR token validation and geofence verification are not connected.
- Pay breakdown and a voice explanation, plus a server-side overtime calculator endpoint with visible assumptions.
- Icon/category-based hazard reports, report tracking, anonymous feedback submission, SOS alert, shift-swap request, skill record, notices and a limited rights helper.
- A service-worker shell cache plus IndexedDB key storage and a signed-event outbox that syncs on reconnect. Multi-event offline ordering and guaranteed browser background sync still need end-to-end testing.

### Admin interface

- Workforce overview, safety queue, status updates, compliance sample findings, fairness score breakdown and sector selection.
- Forecast and roster proposal endpoints, weekly briefing, allowlisted insights endpoint, feedback privacy gate, contractor and certification views.
- Ledger integrity verification and a clearly labelled demo tamper test; CSV attendance export.
- Sector pack selection, simulated hospital pack, rule-pack draft compiler, simulated rule-change watcher and SDG 8 impact metrics.

### API endpoints

The API is prefixed with `/api`. Key routes include:

| Route | Purpose |
|---|---|
| `GET /health` | Service status and mode |
| `GET /worker/home` | Worker demo data, receipts, reports, pay, notices, skills and requests |
| `POST /checkin` | Record a check-in/out event, verify a registered device signature when provided, and add an organization countersignature |
| `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` | Password/PIN login and expiring sessions; role guards activate with `DEMO_MODE=0` |
| `POST /auth/register-device` | Register a worker device public key |
| `POST /pay/check-week` | Seven-day daily/weekly overtime calculation without double counting |
| `GET /fatigue/:workerId` | Explainable rule-based fatigue estimate |
| `GET /export/inspection.pdf`, `GET /export/impact.pdf`, `GET /disputes/:id/pdf` | Dependency-free PDF demo exports |
| `POST /demo/scenario/:id` | Trigger scenario S1–S9 helper workflow |
| `POST /agents/run`, `GET /agents/runs` | Deterministic mock agent framework with validated outputs and run logging |
| `POST /reports` | Create a safety report and possible collective case |
| `PATCH /reports/:id/status` | Update report status and ticket status |
| `GET /admin/dashboard` | Site-level dashboard aggregates |
| `POST /sector-pack` | Activate construction/college demo packs; hospital selection creates a draft pending human approval |
| `POST /pay/check` | Calculate an illustrative overtime/pay comparison |
| `POST /disputes`, `GET /disputes`, `PATCH /disputes/:id` | Open and review a pay dispute |
| `POST /feedback`, `GET /feedback/aggregate` | Anonymous feedback with a minimum-five aggregation gate |
| `POST /notices` | Create a notice; translations are explicitly simulated |
| `POST /swaps`, `PATCH /swaps/:id` | Request and decide a shift swap/leave item |
| `POST /sos`, `PATCH /sos/:id` | Create and acknowledge a demo SOS alert |
| `POST /skills`, `GET /skills`, `GET /skills/:id/verify` | Demo skill passport records and signature check |
| `GET /forecast`, `POST /roster/optimise` | Simulated forecast and roster proposal |
| `GET /fairness`, `GET /impact` | Explainable illustrative site-level metrics |
| `GET /insights?question=...`, `GET /briefing` | Restricted metric answer and weekly mock briefing |
| `GET /rules`, `POST /rules/compile`, `POST /rules/:id/approve` | Draft rule pack flow with human-review status |
| `POST /rule-watcher/check` | Simulated rule change alert; external URL fetching is disabled |
| `GET /ledger/verify`, `POST /ledger/tamper-test` | Hash-chain verification and demo tamper test |
| `GET /export/attendance.csv` | CSV attendance export |
| `POST /reset` | Reset the demo dataset to baseline synthetic records |

## Local demo accounts

- Worker: phone `9000000101`, PIN `1234`
- Admin owner: `admin@fairshift.demo`, password `admin1234`
- Manager: `manager@fairshift.demo`, password `manager1234`

These credentials are synthetic and must be changed before any non-demo use. `DEMO_MODE=1` is the default and intentionally bypasses auth guards so the supplied UIs can be explored without login. Set `DEMO_MODE=0` to exercise API authentication; the current UI does not yet provide a complete production login flow.

## Important prototype limits

The supplied Master Build Spec describes a substantially larger production-grade system. This repository remains a hackathon prototype and is **not yet a complete implementation of every acceptance criterion**. It now includes password/PIN authentication, expiring opaque sessions, role checks when `DEMO_MODE=0`, device ECDSA signatures and organization countersignatures, basic offline outbox retry, PDF exports, mock agents and eval fixtures. Remaining gaps include full organization-level isolation, rotating QR/geofence validation, background escalation scheduler, real Gemini and embeddings, semantic clustering, complete multilingual translation, full browser E2E/accessibility/performance testing, and production security review. The interfaces/API paths are useful for a hackathon demo but should not be represented as those completed controls.

## Commands

```bash
npm run seed       # seed synthetic data
npm run reset      # reset seed data
npm run dev        # start API, worker UI and admin UI
npm run evals      # run deterministic mock-agent evaluation cases
npm test           # run Vitest tests
npm run typecheck  # TypeScript type-checking (requires npm install)
npm run lint       # ESLint (requires npm install)
```

## Demo accounts and data

The current prototype uses a fixed fictional worker (`W-101`) and synthetic admin/site data; authentication screens and production identity verification are not implemented. Sample organisations and workers are fictional. Use the Demo Script in `docs/DEMO_SCRIPT.md` for a short presentation.

## SDG 8 alignment

- **Target 8.5:** transparent pay breakdowns, overtime comparisons and dispute tracking.
- **Target 8.8:** hazard reporting, ticket tracking, collective voice concepts, fatigue/safety indicators.
- **Skills and employability:** portable demo skill records.

All impact metrics are synthetic indicators and do not establish measured real-world outcomes.

For browser acceptance checks, install the Playwright browser once and run the E2E suite:

```bash
npx playwright install chromium
npm run e2e
```

The tests are included but have not been executed in this generation environment.

## Visual direction

The admin dashboard uses a calm pastel-sage palette, white panels, muted mint/blue/lilac indicators, restrained warning colours, rounded cards and responsive layouts. The worker app is mobile-first with large tap targets and simple navigation.

## Google Cloud and submission

See [`docs/GOOGLE_CLOUD_DEPLOYMENT.md`](docs/GOOGLE_CLOUD_DEPLOYMENT.md) for a single-repository Cloud Run deployment path and [`docs/RELEASE_CHECKLIST.md`](docs/RELEASE_CHECKLIST.md) for pre-submission verification. `Dockerfile.api` and `Dockerfile.frontend` build the API and the two UIs. This is a deployment recipe only; the services have not been deployed from this environment.

**Repository size:** source-only project files are intended to remain below 10 MB. Exclude `node_modules`, build output, `.env`, local SQLite files, and Git history containing large or sensitive data. Verify the actual `.git` directory size after committing.

**Production caveat:** the included database is SQLite. Cloud Run's local filesystem is ephemeral and is not shared between instances. The deployment recipe is for a synthetic hackathon demo only; migrate to a managed persistent database and complete security review before real use.
