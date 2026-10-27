# FairShift module status (honest implementation map)

This map distinguishes working prototype flows from simulations and remaining work. It is not a claim that all original acceptance criteria have passed.

| # | Module | Current status | Important gap |
|---:|---|---|---|
| 1 | Signed Shift Receipts | Partial working | Device ECDSA + organization countersignature; rotating gate QR and geofence checks remain incomplete. |
| 2 | Auto-Overtime Engine | Working shared calculation + API | Week/day calculation covered by unit tests; full interval/rate-model edge-case suite still needed. |
| 3 | Is My Pay Right? | Partial working | UI breakdown and explanation exist; connect weekly engine to payslip records and localised speech flow. |
| 4 | Dispute Pack | Partial working | Dispute workflow and PDF export exist; no QR on PDF and no fully localised dual-language pack. |
| 5 | Voice Hazard Reporter | Partial working | Speech and icon path exist; image upload and full triage integration incomplete. |
| 6 | Ticket Tracker | Partial working | Ticket/status data and API exist; robust worker-only ticket authorization and live SSE need completion. |
| 7 | Collective Voice | Partial working | HMAC pseudonyms, threshold promotion and aggregate UI exist; semantic embedding clustering and distinct-shift quality need E2E validation. |
| 8 | Honest Feedback | Partial working | Minimum-five aggregate gate exists; identifying-text sanitisation and complete anonymous endpoint logging review remain. |
| 9 | Fatigue & Heat Guardian | Partial working | Explainable rule-based fatigue API and worker nudges exist; live weather/heat-index integration is not connected. |
| 10 | SOS Button | Partial working | SOS record and admin acknowledgement exist; actual external notification is simulated. |
| 11 | Skill Passport | Partial working | Records and demo signature verification exist; credentials are not accredited and signatures are not public-key credentials. |
| 12 | Rights Copilot | Partial working | Rule-pack-grounded mock answers; no Gemini provider integration and no legal advice. |
| 13 | Shift Swap & Leave | Partial working | Request and decision endpoints exist; optimizer constraints and notification flow are incomplete. |
| 14 | Voice Notice Board | Partial working | Notice and speech UI exist; translations are labelled simulated. |
| 15 | Compliance Autopilot | Partial working | Seeded findings and payroll APIs; full rules-driven scans over every worker/period need wiring. |
| 16 | Cost-of-Compliance Simulator | Partial working | Demo UI data exists; live scenario recalculation needs completion. |
| 17 | Workforce Health Dashboard | Partial working | Dashboard loads seeded and live API values; some tiles are illustrative. |
| 18 | Escalation Engine | Incomplete/simulated | Status updates exist; background scheduler, SLA timers and escalation notifications are not implemented. |
| 19 | Explainable Quit-Risk | Simulated | Team-level sample drivers only; calibrated formula and historical snapshots need implementation. |
| 20 | Workforce Forecast | Simulated/rule-based | 72-hour scenario output exists; forecast model and weather provider are not connected. |
| 21 | Roster Optimiser | Simulated | Proposal endpoint exists; constraint solver and actual schedule persistence/worker notification are incomplete. |
| 22 | Fairness Index & Badge | Partial working | Explainable weighted score and trend endpoint exist; public badge page and all score inputs need wiring. |
| 23 | Ask-Your-Data | Partial working | Metric whitelist and deterministic mock answers exist; broader query parameter tests remain. |
| 24 | Weekly AI Briefing | Mock working | Deterministic briefing with evidence hints; downloadable report and real model mode incomplete. |
| 25 | Mediator Agent | Mock working | Schema-constrained neutral mock output; no actual dispute evidence orchestration. |
| 26 | Contractor Payment Tracker | Partial working | Seeded contractor payment tracking and delay flags exist; payment-chain audit workflow needs completion. |
| 27 | Safety Certification Tracker | Partial working | Expiry data and endpoint exist; worker/admin UI integration needs completion. |
| 28 | Inspection-Ready Export | Partial working | CSV and text PDF export exist; not an official register and lacks QR/complete required register formats. |
| 29 | Sector Pack Engine | Partial working | Construction/college packs and hospital draft generator exist; approval is demo-only and packs need complete validation. |
| 30 | Rule Pack Compiler | Simulated draft | Human-review draft endpoint exists; legal extraction is not implemented. |
| 31 | Rule-Change Watcher | Simulated | Alert/diff endpoint exists; external fetching is disabled for SSRF safety. |
| 32 | Tamper-Evident Ledger | Partial working | SHA-256 chain verification and demo tamper test exist; receipt and ledger verification need broader consistency checks. |
| 33 | Privacy & Access Layer | Partial working | scrypt login, expiring sessions and role guard exist in non-demo mode; full org-scoped query isolation is incomplete. |
| 34 | Voice & Local Layer | Partial working | Language selector, Web Speech wrappers and fallbacks exist; dynamic translation quality is simulated. |
| 35 | Agent Crew & Prompt Library | Partial working | Five prompt files, mock outputs, run logs and 50 eval fixtures exist; eval runner checks execution/validation, not semantic quality. |
| 36 | Synthetic Data Generator | Partial working | Seed/reset scripts create deterministic-shaped demo scenarios; timestamps vary with execution time and exact determinism needs tightening. |
| 37 | SDG 8 Impact Report | Partial working | Metrics endpoint and PDF export exist; all numbers are synthetic, not real impact measurement. |
| 38 | Multichannel Fallback | Simulated/not connected | No real SMS, WhatsApp, IVR or provider adapter is connected. |

## Verification status

Source syntax transpilation and SQLite schema parsing passed in the generation environment. Full TypeScript typecheck, dependency installation, Vitest execution, agent eval execution, Playwright, axe, performance testing and browser acceptance checks have **not** been run successfully in this environment. Run the project commands from the README on a machine with dependencies installed before presenting it as a tested build.
