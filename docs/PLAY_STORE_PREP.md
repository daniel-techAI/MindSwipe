# MindSwipe Google Play preparation

Last verified: 2026-09-02

Status: **SIGNED RELEASE WORKFLOW IMPLEMENTED; SECRETS AND FIRST SIGNED RUN PENDING. NOT A PRODUCTION STORE RELEASE.**

## Target API

Google's current requirement says that starting **August 31, 2026**, new apps and app updates generally must target Android 16 / API 36 or higher, with platform-specific exceptions. An extension to November 1, 2026 may be available through Play Console.

MindSwipe currently sets:

- `minSdkVersion = 24`
- `compileSdkVersion = 36`
- `targetSdkVersion = 36`
- `versionCode 2`
- `versionName 0.2.0`

Source: https://developer.android.com/google/play/requirements/target-sdk

Reverify immediately before submission; meeting a target SDK value does not prove policy or behavioral compatibility.

## Build state

The repository commits the Capacitor Android project. The debug workflow:

1. installs Java 21 and Android API 36;
2. runs `npm ci` and `npm run check`;
3. runs `npx cap sync android`;
4. verifies required notification permissions and absence of location permission;
5. runs Gradle lint and unit tests;
6. builds debug APK and debug AAB artifacts.

Debug artifacts are not acceptable as a production release.

The manual `Build signed Android release` workflow is implemented to run the same repository checks, restore an upload keystore from protected GitHub Actions secrets, build signed APK and AAB artifacts, verify them with `apksigner` and `jarsigner`, publish both to a GitHub prerelease, and remove the temporary key from the runner. Gradle fails closed if a release artifact is requested without all signing variables. The required GitHub Actions secrets are configured; a successful release run must still be verified for each source commit intended for distribution.

## Permissions

Declared:

- `INTERNET`: deployed web resources and explicit external links/navigation.
- `POST_NOTIFICATIONS`: optional local quote reminders on supported Android versions.
- `SCHEDULE_EXACT_ALARM`: user-selected exact reminder timing. Access is not automatic; the app opens Android settings only after the user selects exact mode.

Not declared: location, background location, camera, microphone, contacts, storage, advertising ID.

Google Play permission policy and the exact-alarm use case must be reviewed against the final artifact. MindSwipe uses `SCHEDULE_EXACT_ALARM`, not the restricted auto-granted `USE_EXACT_ALARM` permission.

Source: https://support.google.com/googleplay/android-developer/answer/16558241

## Data Safety working facts

Repository behavior currently shows:

- no account or remote user database;
- no analytics, ads, payments, crash-reporting, marketing, or AI SDK;
- no GPS/location;
- local progress, Saved items, trips, notes, and reminders;
- no automatic transmission of those records;
- user-triggered external Google Maps, Waze, source/license, GitHub, policy, and support/email actions.

These are engineering facts, not a completed Play Console answer. Inspect the final signed AAB and every dependency before submitting Data safety.

## Production requirements

- `[OWNER DECISION REQUIRED]` Complete Play developer/publisher account verification.
- Protected upload key, DPAPI-protected local recovery record, and GitHub Actions secret-based signing path.
- Signed release AAB using the release build type; never commit credentials.
- Internal and required closed testing with real devices and Android versions.
- Exact-alarm denial/revocation/restart tests.
- Final app icon, splash behavior, screenshots, feature graphic, listing copy, category, and localization decisions.
- Privacy, Terms, and Support pages and their intended GitHub Pages URLs are prepared; deployment and public URL verification remain pending until this feature reaches `main`.
- Monitored support email is `daniellaky5.c@gmail.com`; final business/address disclosures remain an owner/legal decision.
- Data safety, content rating, target audience, ads declaration, and app-access forms.
- Accessibility and content/source/license human review.
- Release notes, version/update date, rollback plan, and support path.

## Monetization

No billing exists. Future options are free core, premium destination packs, one-time unlock, or subscription only after retention supports it. Before implementation, recheck Google Play Billing, refunds/cancellation, tax/VAT, consumer terms, operator registration, and privacy/store disclosures.

## Classification

An APK or signed AAB existing is not release readiness. MindSwipe should move from **signed artifact** to **internal test**, then any required **closed test**, and only then be considered for production after all owner/human actions are complete.
