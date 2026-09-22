# MindSwipe V2

MindSwipe is a privacy-first anti-doomscrolling microlearning app. It turns the simplicity of swiping into two useful modes:

- **Learn:** three short cards selected from the user's interests, followed by a streak check.
- **Explore:** three sourced destination cards, useful places, and local trip planning that hands navigation to Google Maps or Waze.

> **Status: public beta candidate, not a production store release.** Learn and Explore are merged. Android release signing secrets are configured, and the release workflow builds an installable APK plus a Play-ready-format AAB. Verified builds are published as GitHub prerelease downloads. Store publication still requires device/track testing, store forms/assets, publisher verification, and human policy/legal review. The repository is currently private; a public Pages deployment has not been verified.

## Current V2 scope

### COMPLETE

- Existing Learn cards, swipes, explicit action buttons, quiz gate, XP, streaks, saved cards, recent cards, quotes, haptics, and local reminders.
- Five-tab mobile navigation: Home, Learn, Explore, Saved, Profile.
- Netherlands Explore pilot for Amsterdam, Utrecht, and Rotterdam.
- 24 sourced Travel cards, 12 sourced places, and locally bundled attributed images.
- Destination and Travel-category filtering with deterministic three-card sessions.
- Shared Learn/Explore progress rather than competing streak systems.
- Saved Travel cards and places.
- Local trips with destination, days, stops, notes, reordering, and moving stops between days.
- Encoded Google Maps place/directions links with safe route segmentation.
- Waze search and single-destination navigation links.
- Versioned local state migration with V1 and corrupt-state backups.
- Installable, project-path-safe PWA with offline bundled content and images.
- Committed Capacitor 8 Android project targeting Android 16 / API 36.
- Background flexible and user-selected exact Android reminders.

### NOT IMPLEMENTED

- Accounts, cloud sync, remote database, Firebase, analytics, ads, payments, AI calls, GPS, background location, or remote destination packs.
- Full itinerary import into Google Maps or Waze. Those platforms receive only supported links/segments.
- iOS native project or App Store signing.

## Privacy and network boundary

Progress, interests, saved items, trips, notes, and reminder preferences are stored in local app/browser storage under `mindSwipeProgress`. Native reminders are scheduled on-device. Android cloud backup is disabled.

No hidden telemetry or automatic content API exists. Network access happens only for:

- loading the deployed PWA itself;
- a user opening a cited source or image-license page;
- a user launching Google Maps or Waze;
- a user opening the hosted Privacy, Terms, or Support pages;
- a user emailing support.

The Android manifest declares `INTERNET`, `POST_NOTIFICATIONS`, and `SCHEDULE_EXACT_ALARM`. Exact-alarm settings are requested only if the user selects **Background exact**. No location permission is declared.

## Run locally

Requirements: Node.js 24 or newer and npm.

```bash
npm ci
npm run dev
```

Verification:

```bash
npm run check
npm run test:e2e
```

`npm run check` runs ESLint, Node unit tests, a Vite production build, and deterministic service-worker generation. Playwright covers desktop Chromium and a Pixel 7-sized browser.

## Web and PWA

The configured GitHub Pages URL is:

**https://daniel-techai.github.io/MindSwipe/**

`.github/workflows/deploy-pages.yml` verifies and publishes `dist/` from `main`. Vite uses relative assets so the same bundle works under `/MindSwipe/`, as an installed PWA, and inside Capacitor.

The service worker precaches the complete production build, including the Netherlands pilot and travel images. External source, Google Maps, and Waze pages naturally require a network connection.

## Android

The `android/` project is committed. After web changes:

```bash
npm ci
npm run android:sync
npm run android:open
```

The manual **Build Android APK** workflow installs API 36, runs web checks, syncs Capacitor, verifies the permission boundary, runs Gradle lint/unit tests, and builds debug APK/AAB artifacts.

The manual **Build signed Android release** workflow restores the upload key from encrypted GitHub Actions secrets, builds a signed APK and AAB, verifies both signatures, uploads the artifacts, and removes the temporary key. Install the APK directly for testing; the AAB is for Play Console upload. See [Signing and release](docs/SIGNING_AND_RELEASE.md). Never commit a keystore, signing password, service-account key, or `local.properties`.

## Repository map

- `src/App.jsx`: Learn/session shell, navigation, reminders, onboarding, and shared progress orchestration.
- `src/TravelViews.jsx`: Explore, place details, Saved views, and quick trip creation.
- `src/TripEditor.jsx`: local itinerary editing and external route handoff.
- `src/progress.js`: schema V2 normalization, migration, backup, persistence, and streak rules.
- `src/travelData.js`: sourced Netherlands hierarchy, Travel cards, places, and image metadata.
- `src/trips.js`: immutable trip operations.
- `src/navigationLinks.js`: Google Maps/Waze URL construction and route segmentation.
- `src/knowledgeContent.js`: additional sourced Learn categories.
- `scripts/create-service-worker.mjs`: deterministic offline worker generation.
- `android/`: Capacitor Android wrapper and API 36 build configuration.
- `tests/` and `e2e/`: unit, offline/path, accessibility, and workflow coverage.
- `docs/`: architecture, sourcing, travel, privacy, release, legal, and future plans.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Travel mode](docs/TRAVEL_MODE.md)
- [Content sourcing](docs/CONTENT_SOURCING.md)
- [Privacy policy](docs/PRIVACY_POLICY.md)
- [Legal and compliance](docs/LEGAL_AND_COMPLIANCE.md)
- [Terms of use](docs/TERMS_OF_USE.md)
- [Signing and release](docs/SIGNING_AND_RELEASE.md)
- [Policy research](docs/POLICY_RESEARCH.md)
- [Play Store preparation](docs/PLAY_STORE_PREP.md)
- [Release checklist](docs/RELEASE_CHECKLIST.md)
- [Measurement plan](docs/MEASUREMENT_PLAN.md)
- [Future location mode](docs/LOCATION_MODE_FUTURE.md)

## Owner decisions required

- `[OWNER DECISION REQUIRED]` Final legal form, country, and address disclosures required for commercial publication.
- `[OWNER DECISION REQUIRED]` Play Console publisher account verification and launch countries.
- `[OWNER DECISION REQUIRED]` Monetization timing and model.
- `[OWNER DECISION REQUIRED]` Whether analytics will ever be added and which privacy-reviewed stack to use.
- `[OWNER DECISION REQUIRED]` Whether a future opt-in location feature is valuable enough to justify permission and policy work.

## License

Copyright (c) 2026 MindSwipe. All rights reserved. The public repository permits review but does not grant rights to copy, redistribute, sell, or create derivative products. See [LICENSE](LICENSE).
