# MindSwipe V2 release checklist

## Automated repository checks

- [x] ESLint includes React hooks and JSX accessibility rules.
- [x] Unit tests cover progress migration/streaks, travel filtering/validation, trip operations, map/Waze links, and PWA path/offline generation.
- [x] Playwright covers first run, keyboard use, Learn controls, Explore filtering/completion, Travel saves, trip persistence, reduced motion, accessibility, manifest, and desktop/Android-sized viewports.
- [x] Android project targets API 36 and is committed.
- [x] Android workflow verifies no location permission and builds debug APK/AAB.
- [x] Release Gradle configuration reads credentials only from environment variables and fails closed when absent.
- [x] Manual release workflow definition builds and verifies a signed AAB from protected GitHub Actions secrets.
- [x] Public Privacy, Terms, and Support pages identify Daniel Laky and `daniellaky5.c@gmail.com`.

## Native build and device testing

- [x] Run the manual debug Android workflow and retain successful Gradle lint/test/build logs.
- [ ] Install the generated debug APK on at least one real API 36 device/emulator and one older supported device.
- [ ] Test upgrade from the previous APK and confirm progress migration/backup.
- [ ] Test offline launch after a successful online install/sync.
- [ ] Test flexible reminder while app is backgrounded and terminated.
- [ ] Test exact reminder grant, denial, revocation, device restart, time change, timezone change, and battery restrictions.
- [ ] Confirm notification tap opens quote settings.
- [ ] Confirm source, Google Maps, and Waze handoffs on devices with and without target apps installed.
- [ ] Confirm no location prompt appears.
- [ ] Test TalkBack, larger fonts, dark contrast, keyboard/switch access where available, and reduced motion.

## Release engineering

- [x] Create/protect upload key and signing configuration outside git.
- [ ] Configure the four required GitHub Actions signing secrets.
- [ ] Produce and cryptographically verify the first signed release AAB through GitHub Actions.
- [ ] Inspect merged release manifest and dependency report.
- [ ] Verify release `versionCode`/`versionName` and reproducible source commit.
- [ ] Enable minification only after release-rule testing; document the decision.
- [ ] Define rollback and hotfix process.

## Product/content

- [ ] Human copy/typo pass on every screen and both viewport classes.
- [ ] Human source and image-license pass on all 24 cards and 12 places.
- [ ] Open every citation, license, Google Maps, and Waze link.
- [ ] Confirm disclaimer is visible without overwhelming the core experience.
- [ ] Decide whether the current app icon/launch screen is final.
- [ ] Run a multi-day retention test to evaluate repetition and streak behavior.

## Store and legal

- [x] Public operator name: Daniel Laky.
- [x] Monitored support email: `daniellaky5.c@gmail.com`.
- [x] Privacy, Terms, and Support page files and intended GitHub Pages URLs are prepared.
- [ ] Merge/deploy the pages and verify all three public URLs return successfully.
- [ ] `[OWNER DECISION REQUIRED]` Final legal form, launch countries, and any mandatory business/postal address disclosure.
- [ ] Human/legal review of privacy, Terms, travel disclaimer, licensing, and launch-market requirements.
- [ ] Data safety form based on the signed artifact.
- [ ] Exact-alarm permission policy review/declaration where required.
- [ ] Content rating, target audience, ads declaration, category, and app-access details.
- [ ] Final screenshots, feature graphic, descriptions, release notes, and support path.
- [ ] Play developer/publisher verification and current testing-track requirements.

## Explicitly later

- [ ] Analytics only after owner decision and privacy/store review.
- [ ] Monetization only after retention evidence and fresh billing/legal review.
- [ ] Optional foreground/approximate location only after explicit product/privacy decision.
- [ ] iOS only after shared product and legal identity are stable.
