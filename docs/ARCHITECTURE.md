# MindSwipe architecture

## Runtime

MindSwipe is a client-only React application built with Vite. Capacitor wraps the same `dist/` output for Android. There is no application backend in this repository.

```text
content modules ──> React session UI ──> local progress state
                                         │
                                         ├── localStorage
                                         ├── Capacitor haptics
                                         └── Capacitor local notifications
```

## Sources of truth

- `src/content.js`, `src/quoteBank.js`: user-facing learning material.
- `src/App.jsx`: navigation, session selection, progress persistence, reminders, and native capability checks.
- `src/pwa.js`: base-path-safe service-worker registration.
- `src/*.css`: responsive presentation.
- `public/manifest.webmanifest`: installable web-app identity.
- `scripts/create-service-worker.mjs`: deterministic precache generation from the completed Vite build.
- `capacitor.config.json`: Android application ID, web output directory, and native plugin configuration.

## Data and trust boundaries

- Progress is serialized under the `mindSwipeProgress` browser-storage key.
- The reset control removes that local progress record.
- Native notification schedules stay on the device.
- No code path currently sends progress to an application server.
- Content is bundled with the application and is not remotely generated.

These statements must be revalidated whenever networking, analytics, ads, accounts, payments, crash reporting, or cloud synchronization are added.

## Release boundaries

`npm run check` lints, tests, and builds the web app. GitHub Pages publishes the installable PWA from `main`. The manual Android workflow generates unsigned debug artifacts only. Production store distribution still requires a protected signing process, a signed release AAB, store-policy review, device testing, and a public support contact.
