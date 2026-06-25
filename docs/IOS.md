# MindSwipe iOS Plan

MindSwipe should stay in one shared repository for now. The React app is the source of truth, and Capacitor can wrap the same web build for Android and iOS.

## Why not a second repo yet

- One codebase keeps features, content, colors, and fixes aligned.
- Android APK builds can keep running remotely while the product is changing fast.
- A second repo would double maintenance before there is a real iOS-specific reason.

## What iOS needs later

- Apple Developer Program membership for App Store publishing.
- Xcode and a Mac build environment, or a paid CI setup that supports iOS signing.
- Capacitor iOS added with `npx cap add ios`.
- App icons, launch screen, bundle ID, privacy details, and signing certificates.
- A signed `.ipa` or App Store upload through Xcode/Transporter.

## Practical path

1. Improve the shared app until the product feels worth testing daily.
2. Keep Android debug APK builds on GitHub Actions for fast testing.
3. Add iOS only after the core loop, content, privacy policy, and app identity are stable.
