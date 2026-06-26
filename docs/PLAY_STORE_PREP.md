# MindSwipe Play Store Prep

## Current Position

MindSwipe is still in debug-build mode. The GitHub workflow now produces:

- `MindSwipe-debug-apk` for phone testing.
- `MindSwipe-debug-aab` to prove the Android App Bundle build path works.

Google Play publishing still needs a signed release AAB, final store assets, and Play Console policy forms.

## Must-Have Before Publishing

1. Create a Google Play Developer account.
2. Build a signed release AAB, not a debug build.
3. Add a public privacy policy URL.
4. Complete Play Console Data safety.
5. Complete content rating.
6. Set target audience and ads declaration.
7. Add app icon, screenshots, short description, full description, and feature graphic.
8. Test install and reminder flow on a real Android phone.
9. Run a closed test before public release.

## Store Listing Draft

App name: MindSwipe

Short description:
Swipe through short mindset, money, and habit cards when you are about to waste time scrolling.

Full description:
MindSwipe helps you replace dead scrolling with quick, practical mental resets. Pick your mood, swipe through three direct cards, save useful moves, and set a daily quote reminder to keep one better thought in your day.

Built for people who want simple prompts, not long lectures. Use it when you are bored, stressed, avoiding work, or trying to rebuild focus.

Core features:
- Three-card swipe sessions.
- Mood-based quote of the day.
- Daily Android reminder notifications.
- Saved moves for quick review.
- Progress, streaks, XP, and rescued scrolling minutes.
- Content packs for comeback, focus, discipline, confidence, work, and income.

## Data Safety Draft

Current app behavior based on the code in this repo:

- No account login.
- No remote database.
- No analytics SDK.
- No ads SDK.
- No user data sent to a backend.
- Progress is stored locally on the device through browser/app local storage.
- Notifications are scheduled locally on the device.

Likely Play Console Data safety answer for this version:

- Data collected: no, if no analytics/ads/backend is added.
- Data shared: no, if no analytics/ads/backend is added.
- Data encrypted in transit: not applicable for user data, if no user data is transmitted.
- Data deletion request: not applicable for server data, but users can clear app storage/uninstall.

Recheck this if we add ads, payments, login, analytics, crash reporting, cloud sync, email capture, or AI/server features.

## Policy Notes

Google says the Data safety form requires reviewing collection/sharing, declared permissions, APIs, and adding a privacy policy. Google Play also requires new apps and updates to target Android 15 / API 35 or higher as of the current Android Developers target API page.

Sources:
- https://support.google.com/googleplay/android-developer/answer/10787469
- https://developer.android.com/google/play/requirements/target-sdk
- https://developer.android.com/guide/app-bundle
