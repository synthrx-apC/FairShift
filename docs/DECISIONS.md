# Decisions log

- The prototype prioritises a runnable worker/admin loop over implementing every module in the master spec.
- Demo persistence uses SQLite with SQL schema setup in `server/src/db.ts`; legal values are illustrative and `verified:false`.
- AI is deterministic/mock only in this prototype. No model key is required.
- Worker report pseudonyms are stored server-side for anti-spam/aggregation but never returned from API responses. This demo does not claim perfect anonymity.
- Receipt signing, QR validation, geofencing, offline outbox, production authentication, and true organisation key countersigning are not implemented; the UI labels check-ins as simulated.
- Hospital sector pack activation is a prepared mock pack and is not legal or operational guidance.
