# Google Play Console declaration working sheet

Last updated: 2026-09-02

Status: **ENGINEERING DRAFT. CONFIRM AGAINST THE FINAL SIGNED AAB AND CURRENT PLAY CONSOLE WORDING.**

## App identity

- App name: MindSwipe
- Package: `com.mindswipe.app`
- Version: `0.2.0` (`versionCode 2`)
- Operator/developer contact: Daniel Laky, `daniellaky5.c@gmail.com`
- Privacy: https://daniel-techai.github.io/MindSwipe/privacy.html
- Terms: https://daniel-techai.github.io/MindSwipe/terms.html
- Support: https://daniel-techai.github.io/MindSwipe/support.html
- Suggested category for owner review: Education
- Intended audience: age 16 and older

## Data safety working answer

Verified code behavior: MindSwipe has no developer backend, account, analytics, advertising, crash-reporting, marketing, payment, AI, cloud-sync, or location SDK. Progress, interests, saved items, trips, notes, and reminders remain on the device. Android cloud backup is disabled.

The current engineering assessment is that the Android app does not collect or share app-user data with the developer through the app. User-chosen handoffs to Google Maps, Waze, source/license pages, GitHub, or an email client are explicit actions to independent services. Do not submit this assessment blindly: inspect the final dependency graph and merged manifest, then apply the exact current Play definition of collection, sharing, service providers, and user-initiated transfers.

## Other working declarations

- Ads: **No ads**; no ad SDK exists.
- App access: all core functionality is available without an account or restricted login.
- Location: not requested or used.
- Financial features: none.
- Health features: none.
- News/government: none.
- Exact alarm: `SCHEDULE_EXACT_ALARM` supports an optional user-selected exact daily learning reminder; flexible reminders remain available without exact timing.
- Target API: API 36; reverify the submission rule immediately before upload.
- Content rating: complete honestly in Play Console; the current content model contains general learning and travel education, not user-generated public content.

## Owner/Play Console actions

- `[OWNER DECISION REQUIRED]` Legal account type, country, launch countries, and required address/contact disclosures.
- Complete developer identity verification.
- Confirm the 16+ target-audience selection and content rating.
- Review exact-alarm eligibility and declaration against current policy.
- Upload final screenshots, feature graphic, app icon, descriptions, and release notes.
- Run internal testing and any closed-testing requirement shown by the account.
- Complete Data safety against the exact signed release artifact.

This worksheet is not a substitute for the live Play Console forms or legal review.
