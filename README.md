# MindSwipe

MindSwipe replaces doomscrolling with focused three-card learning sessions for discipline, money, work, confidence, and attention.

> **Project status:** installable web prototype and Android debug build. MindSwipe currently has no account system, analytics SDK, advertising SDK, or remote user database. Progress and reminder preferences stay on the device.

## Open the web app

The GitHub Pages deployment is configured for:

**https://daniel-techai.github.io/MindSwipe/**

The URL becomes live after the Pages workflow is enabled for the repository and this work reaches `main`.

### Install on Android or desktop

1. Open the web app in Chrome on Android, Windows, macOS, or Linux.
2. In MindSwipe, choose **Show install help** or open **Settings > Install MindSwipe**.
3. Use Chrome's **Install app** or **Add to Home screen** action when offered.

The installed Progressive Web App opens in its own window and keeps the app shell available offline after the first successful visit. Browser notifications only work while the web app is open; scheduled background reminders are a native Android capability.

## What works

- Mood-based three-card rescue sessions with touch gestures and explicit keyboard-accessible controls.
- Practical content packs for focus, habits, work, money basics, and confidence.
- Saved-card replay, XP, streaks, missions, and rescued-time tracking.
- Local progress storage with a confirmed in-app reset.
- Installable PWA with scoped GitHub Pages paths, raster icons, and an offline service worker.
- Capacitor Android wrapper with optional local notifications and haptic feedback.
- Responsive layouts, visible focus states, reduced motion, skip navigation, and text alternatives for gesture actions.

## Run locally

Requirements: Node.js 24 or newer and npm.

```bash
npm ci
npm run dev
```

Open the address printed by Vite. Before committing a change, run:

```bash
npm run check
```

That command lints the React accessibility and hooks rules, runs the service-worker tests, and creates the production web build in `dist/`.

## Static web deployment

`.github/workflows/deploy-pages.yml` validates the app and publishes `dist/` to GitHub Pages whenever `main` changes. In repository **Settings > Pages**, set the source to **GitHub Actions** once. The workflow uses read-only repository access during the build and grants Pages/OIDC write permissions only to the deployment job.

Relative asset URLs allow the same production bundle to work under the `/MindSwipe/` GitHub project path and in the Capacitor wrapper.

## Android debug build

Install Android Studio, Java 21, and the Android SDK, then run:

```bash
npm ci
npm run android:add   # first Android build only
npm run android:sync  # after web changes
npm run android:open
```

The manual `Build Android APK` workflow produces unsigned debug APK and AAB artifacts for device testing. These artifacts are **not signed production releases** and must not be presented as Play Store-ready downloads. A durable Android release still needs a protected signing key, signed release AAB, Play Console setup, policy forms, final store assets, and real-device/closed-track testing. See [Play Store preparation](docs/PLAY_STORE_PREP.md) and the [release checklist](docs/RELEASE_CHECKLIST.md).

## Privacy boundary

The current app stores onboarding choices, progress, saved cards, streaks, and reminder settings in local storage. Native local notifications are scheduled on the device. Adding accounts, analytics, ads, payments, crash reporting, or cloud sync requires a fresh code review, an updated privacy notice, and updated store disclosures.

The bundled privacy policy is a draft until a monitored support contact and final hosted policy URL are added.

## Repository map

- `src/App.jsx` -- application flow, progress state, reminders, install prompt, and session logic.
- `src/pwa.js` -- base-path-safe service-worker registration.
- `src/content.js` and `src/quoteBank.js` -- learning content.
- `src/*.css` -- responsive presentation and accessibility states.
- `public/` -- PWA metadata, raster icons, source icon, and privacy page.
- `scripts/create-service-worker.mjs` -- deterministic offline worker generation after each build.
- `tests/` -- service-worker and GitHub project-path coverage.
- `capacitor.config.json` -- native wrapper identity and notification configuration.
- `docs/` -- product direction, platform plans, store copy, and release checks.
- `.github/workflows/quality.yml` -- pull-request lint, test, and build gate.
- `.github/workflows/deploy-pages.yml` -- static web deployment.
- `.github/workflows/build-android.yml` -- manually triggered debug Android artifacts.

For design boundaries and data flow, read [the architecture guide](docs/ARCHITECTURE.md).

## Contributing and security

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a change. Report suspected security or privacy problems privately using GitHub's security-advisory flow described in [SECURITY.md](SECURITY.md).

## License

Copyright (c) 2026 MindSwipe. All rights reserved. The public repository makes the source reviewable but does not grant permission to copy, redistribute, sell, or create derivative products. See [LICENSE](LICENSE).
