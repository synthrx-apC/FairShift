# FairShift threat model and privacy limits

FairShift is a hackathon prototype using synthetic data. It must not be used for real employment decisions or as a legal compliance system.

## Implemented protections
- Zod validation on the API's primary input routes, request size limits, Helmet, CORS allowlist and global rate limiting.
- Worker reports and feedback store a pseudonym rather than a `user_id`; report/feedback API results do not return pseudonyms. Aggregated feedback is hidden until at least five records exist.
- Browser worker key generation uses ECDSA P-256; the private key is non-extractable and stored in IndexedDB. A device signature can be verified by the API, and the organization countersigns the receipt. The organization signing key is generated and stored in the local SQLite settings table for this demo, which is **not** production-grade key management.
- The ledger is hash-linked and can be verified; demo tamper test deliberately corrupts a ledger row.
- Login uses scrypt password/PIN hashes and opaque, hashed, expiring sessions. Role checks activate when `DEMO_MODE=0`.
- AI-like outputs use deterministic mock rules, schema validation and run logs; user-provided report text is treated as data.

## Important limits
- `DEMO_MODE=1` is the default and intentionally bypasses auth guards so the hackathon UIs work without sign-in. Never expose this mode to the public internet.
- Organization-scoped query isolation is not yet comprehensively implemented or tested; RBAC is not enough to claim production multitenant isolation.
- The device key registration endpoint is a prototype flow; enrollment authorization needs to be tightened before deployment.
- Rotating QR challenge validation, geofence accuracy checks, anti-replay QR windows, and full offline multi-event ordering are not implemented. The current outbox handles basic signed-event retries and needs Playwright testing.
- Organization keys are stored locally in SQLite. Use a proper secret manager/HSM or protected key file in production.
- The pseudonym HMAC secret falls back to a demo-only value unless `SERVER_SECRET` is configured. Anyone with database access and the server secret could relink pseudonyms. Do not claim perfect anonymity.
- Anonymous endpoints are not yet comprehensively tested for IP/user-agent log suppression in all infrastructure layers.
- The simulated SMS/WhatsApp/IVR channels do not contact real providers. The rule watcher does not fetch arbitrary URLs, which avoids SSRF in the demo but means it cannot monitor official sources yet.
- All rule values are unverified demo defaults; legal rule packs require an official source and human review. The platform provides decision support, not legal advice.

## Before real deployment
Implement and independently test organization-scoped access on every query, strict role authorization, authorized device enrollment, proper key management, session revocation and rotation, upload scanning/EXIF removal, rate-limit review, CSP hardening, SSRF-safe allowlisted source fetching, scheduled escalation, data retention/deletion, accessibility, and E2E security testing.
