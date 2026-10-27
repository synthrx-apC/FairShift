# Performance notes

The worker interface is designed mobile-first and includes a basic production service-worker shell cache. A formal Playwright benchmark under 4× CPU slowdown and Slow 4G has not been run in this environment because dependencies could not be installed during this build session.

Before presenting or deploying:

1. Run `npm install` and `npm run build`.
2. Measure the worker bundle and initial interactive time with Chrome DevTools throttling.
3. Record JS bundle size, first-load time, offline shell behaviour and API error behaviour here.
4. Test at 360×640 and admin at 1440×900; test speech unsupported and reduced-motion settings.

No numeric performance result is claimed until measured.
