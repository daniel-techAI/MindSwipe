# Android signing and release

Last updated: 2026-09-14

Status: **REPOSITORY WORKFLOW COMPLETE. GITHUB ACTIONS SECRETS AND THE FIRST SIGNED RUN REMAIN OWNER WORK.**

## Signing model

MindSwipe uses a dedicated upload key for release AABs. The upload key proves that a bundle came from the project owner. Google Play App Signing should hold and use the production app-signing key distributed to users. Keeping those roles separate allows Google Play's documented upload-key reset process if the upload key is lost or compromised.

Official references:

- https://developer.android.com/studio/publish/app-signing
- https://support.google.com/googleplay/android-developer/answer/9842756

## Repository trust boundary

No keystore or signing password belongs in git. `android/.gitignore` excludes `*.jks` and `*.keystore`. `android/app/build.gradle` reads only these environment variables:

- `MINDSWIPE_KEYSTORE_PATH`
- `MINDSWIPE_KEYSTORE_PASSWORD`
- `MINDSWIPE_KEY_ALIAS`
- `MINDSWIPE_KEY_PASSWORD`

Gradle aborts an `assembleRelease` or `bundleRelease` request when any value is missing. Debug builds remain available without release secrets.

## GitHub Actions secrets

The repository's `Build signed Android release` workflow expects:

- `MINDSWIPE_UPLOAD_KEYSTORE_B64`: Base64 representation of the binary upload keystore;
- `MINDSWIPE_KEYSTORE_PASSWORD`: keystore password;
- `MINDSWIPE_KEY_ALIAS`: upload-key alias;
- `MINDSWIPE_KEY_PASSWORD`: key password.

These secrets must be configured in the GitHub repository before the workflow can run. Their values must never be committed or copied into workflow files, logs, issues, or support messages.

The workflow writes the keystore only to the isolated runner temporary directory, restricts its file mode, builds signed APK and AAB artifacts, verifies them with Android's `apksigner` and Java's `jarsigner`, uploads only those signed artifacts, and removes the temporary key in an `always()` step. GitHub Actions secrets are never available to untrusted pull-request code.

## Local recovery record

The private recovery folder is outside the repository. It contains:

- the PKCS#12 upload keystore;
- the public certificate and SHA-256 fingerprint;
- a Windows DPAPI-encrypted secret record bound to the current Windows user;
- recovery instructions.

Back up that private folder to a secure encrypted location that the owner controls. Do not place it in Drive, a public repository, chat, screenshots, or ordinary email without strong encryption. Losing both the upload key and its recovery record requires the Google Play upload-key reset process. Losing control of the key requires immediate rotation and incident review.

## Creating an artifact

1. Open the GitHub Actions page.
2. Run **Build signed Android release** on the intended commit.
3. Confirm repository checks, Android lint/tests, `bundleRelease`, and `jarsigner` verification pass.
4. Download `MindSwipe-v0.2.0-signed-release-apk` for installation, or `MindSwipe-v0.2.0-signed-release-aab` for Play Console upload, from that workflow run.
5. Record the source commit and artifact hash with the release notes.

The workflow does not upload to Google Play automatically. This intentionally keeps production publication behind Play Console review and human verification.

## Before Play upload

- inspect the merged release manifest and dependency report;
- test the signed artifact through Play internal testing on real devices;
- verify upgrade/migration from the prior installed version;
- validate reminders, offline behavior, external links, large text, TalkBack, and no location prompt;
- complete Data safety, exact-alarm review, ads, target audience, content rating, app access, and publisher contact forms;
- verify public Privacy, Terms, and Support URLs;
- keep signing credentials out of support logs and issue reports.

A signed AAB is a release input, not proof that the app is production-ready.

## September 14 signing setup

The four repository secrets are configured. The final upload certificate SHA-256 is
`D3:0F:D5:07:B0:74:EC:B3:2F:E8:A4:DB:F3:7F:B8:C6:E1:74:3C:24:65:67:40:AF:DA:6B:62:7A:80:FD:20:2C`.
The recovery record is protected with Windows DPAPI on the current owner's PC.
The earlier key on the previous PC was never uploaded by this task.

The release job checks AAB signatures against the upload keystore as an explicit
trust source for the self-signed Android certificate. APK signatures are checked
with Android's `apksigner`. Both artifacts use the same source commit and key.

An older debug APK has a different signing certificate. Android may refuse to
update it with a release APK. Do not recommend uninstalling it without warning
that MindSwipe progress and trips are stored only in that app installation.
