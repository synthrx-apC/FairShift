# Release checklist

- [ ] `npm ci` or `npm install` completes in a clean environment.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes for worker and admin.
- [ ] `npm run evals` passes.
- [ ] Playwright E2E tests pass against a running seeded stack.
- [ ] All simulated functionality is visibly labelled.
- [ ] No secrets or personal data in Git history.
- [ ] Repository (including `.git`) is under 10 MB.
- [ ] Google Cloud deployment smoke tests pass.
- [ ] Persistent database choice reviewed before any real data is used.

A box should be checked only after running and observing the corresponding test. The supplied source has not been certified as production-ready.
