# Mind Swipe

Mind Swipe replaces doomscrolling with short, useful learning sessions.

This repo is intentionally kept lean so GitHub Actions can build the Android APK remotely without needing Replit, pnpm, or a slow local machine.

## What it does now

- Onboards users around their scroll trigger, interest lanes, and first content pack
- Offers Rescue Mode for boredom, stress, focus, and money ideas
- Includes serious content packs: No Money Comeback, Discipline, Social Confidence, Work Grind, Focus, and Online Income Basics
- Runs quick 3-card learning sessions with touch swipe gestures plus Save, Skip, and Done controls
- Uses hook-first cards with useful tiny moves instead of school-style quizzes
- Tracks XP, streaks, streak freezes, completed cards, saved cards, sessions, daily missions, reminder preference, and rescued minutes in local storage
- Includes a saved-ideas replay mode
- Includes PWA metadata, a privacy policy draft, Capacitor Android config, and store-prep docs
- Includes a GitHub Actions workflow that builds a debug APK

## Remote APK build

1. Open this repo on GitHub.
2. Go to Actions.
3. Open Build Android APK.
4. Click Run workflow.
5. Download the MindSwipe-debug-apk artifact.

The debug APK is for testing. Play Store release needs a signed AAB later.

## iOS plan

Use this same repo for iPhone and iPad. Capacitor can generate both Android and iOS apps from the same React source, so a second Apple-only repo would create extra work and risk the two apps drifting apart.

Publishing to the App Store later needs a Mac build environment, Xcode, and an Apple Developer account. Until then, keep product changes in this shared repo and add iOS signing/build steps only when the app is ready for store submission.
