# Mind Swipe

Mind Swipe replaces doomscrolling with short, useful learning sessions.

This repo is intentionally kept lean so GitHub Actions can build the Android APK remotely without needing Replit, pnpm, or a slow local machine.

## What it does

- Onboards users by interest area
- Starts quick 3-card learning sessions
- Tracks XP, streaks, completed cards, and saved cards in local storage
- Includes PWA metadata, a privacy policy draft, and Capacitor Android config
- Includes a GitHub Actions workflow that builds a debug APK

## Remote APK build

1. Open this repo on GitHub.
2. Go to Actions.
3. Open Build Android APK.
4. Click Run workflow.
5. Download the MindSwipe-debug-apk artifact.

The debug APK is for testing. Play Store release needs a signed AAB later.
