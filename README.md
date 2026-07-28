# MindSwipe

MindSwipe replaces doomscrolling with focused three-card learning sessions for discipline, money, work, confidence, and attention.

> **Project status:** public prototype and Android debug build. MindSwipe currently has no account system, analytics SDK, advertising SDK, or remote user database. Progress and reminder preferences stay on the device.

## What works

- Mood-based three-card rescue sessions with touch gestures and explicit controls.
- Practical content packs for focus, habits, work, money basics, and confidence.
- Saved-card replay, XP, streaks, missions, and rescued-time tracking.
- Local progress storage with a complete in-app reset.
- Installable web-app metadata and a Capacitor Android wrapper.
- Optional Android local notifications and haptic feedback.

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

The check creates a production web build in `dist/`. There is no automated test suite yet.

## Android debug build

Install Android Studio, Java 21, and the Android SDK, then run:

```bash
npm ci
npm run android:add   # first Android build only
npm run android:sync  # after web changes
npm run android:open
```

The repository also contains a manual `Build Android APK` workflow. It produces unsigned debug APK and AAB artifacts for testing; it does not create a Play Store release. See [Play Store preparation](docs/PLAY_STORE_PREP.md) and the [release checklist](docs/RELEASE_CHECKLIST.md).

## Privacy boundary

The current app stores onboarding choices, progress, saved cards, streaks, and reminder settings in local storage. Local notifications are scheduled on the device. Adding accounts, analytics, ads, payments, crash reporting, or cloud sync requires a fresh code review, an updated privacy notice, and updated store disclosures.

The bundled privacy policy is a draft until a real support contact and hosted policy URL are added.

## Repository map

- `src/App.jsx` — application flow, progress state, reminders, and session logic.
- `src/content.js` and `src/quoteBank.js` — learning content.
- `src/*.css` — visual system and responsive layout.
- `public/` — PWA metadata, icons, and the privacy page.
- `capacitor.config.json` — native wrapper identity and notification configuration.
- `docs/` — product direction, platform plans, store copy, and release checks.
- `.github/workflows/build-android.yml` — manually triggered debug artifact build.

For design boundaries and data flow, read [the architecture guide](docs/ARCHITECTURE.md).

## Contributing and security

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a change. Please report suspected security or privacy problems privately using GitHub's security-advisory flow described in [SECURITY.md](SECURITY.md).

## License

Copyright © 2026 MindSwipe. All rights reserved. The public repository makes the source reviewable but does not grant permission to copy, redistribute, sell, or create derivative products. See [LICENSE](LICENSE).
