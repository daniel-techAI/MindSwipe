# Contributing to MindSwipe

MindSwipe is an early product, so focused fixes and evidence-backed improvements are more useful than large rewrites.

## Before opening a pull request

1. Open an issue for a substantial feature or data-model change.
2. Create a short branch from `main`.
3. Install with `npm ci` and run `npm run check`.
4. Test the affected flow at mobile width and confirm progress survives a reload.
5. If notifications changed, test both permission acceptance and denial on Android.

## Pull-request expectations

- Explain the user problem and the smallest change that solves it.
- Keep user progress backward compatible or include an explicit migration.
- Do not introduce tracking, advertising, accounts, remote storage, or payments without corresponding privacy and store-disclosure changes.
- Do not commit `.env` files, signing keys, API credentials, generated Android projects, or production store certificates.
- Identify any new dependency and why it is necessary.

Content contributions must be original, practical, and free of medical, legal, investment, or guaranteed-income claims.
