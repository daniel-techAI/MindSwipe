# MindSwipe privacy policy - draft

Last updated: 2026-08-16

Status: **OWNER AND LEGAL REVIEW REQUIRED.**

Operator: `[OWNER DECISION REQUIRED]`

Support email: `[OWNER DECISION REQUIRED]`

Public policy URL: `[OWNER DECISION REQUIRED]`

## Overview

MindSwipe currently works without an account, remote user database, analytics SDK, advertising SDK, payment SDK, cloud sync, or location access.

## Information stored on the device

MindSwipe stores the following locally in browser/app storage:

- tutorial/onboarding status and selected interests;
- content-pack and reminder preferences;
- completed/recent/saved card IDs and saved place IDs;
- XP, streaks, session counters, and related local progress;
- local trips, day/stop organization, and user-written trip notes;
- one migration backup of an older progress record, or one corrupt-record backup if recovery is needed.

This data is used to operate and personalize the app on that device. The current code does not transmit it to a MindSwipe server. Android cloud backup is disabled for the app.

## Notifications

If the user enables reminders, MindSwipe schedules local notifications on the device. Android may request notification permission. If the user explicitly selects exact delivery, Android may also open its **Alarms and reminders** setting for exact-alarm access. Flexible delivery does not require exact timing.

Users can disable reminders in MindSwipe or Android system settings.

## Location

MindSwipe does not request or use GPS, approximate location, precise location, background location, or geofencing in the current version. Destinations are selected manually.

## Network and third parties

MindSwipe makes no hidden analytics or profile requests. Network use can occur when:

- the web/PWA is loaded from its host;
- the user opens a cited source or image-license page;
- the user chooses a Google Maps or Waze action;
- the user opens the public privacy/support page.

Those external services apply their own terms and privacy policies. The app sends only the encoded place/directions parameters necessary for the user-selected handoff; it does not send local progress or trip notes.

## Sharing and sale

The current version does not sell personal data or share local progress with advertisers, analytics providers, or an application backend.

## Removing local data

The in-app reset removes the active local progress record and local migration/recovery backups. Users can also clear site/app storage or uninstall. MindSwipe has no server copy to delete in this version.

## Children

`[OWNER DECISION REQUIRED]` Confirm the intended age/target audience before store publication. The current product is not intentionally designed as a child-directed service.

## Security and retention

Local data remains until the user resets it, clears storage, or uninstalls. Device/browser security controls access. Do not enter highly sensitive information in free-text trip notes.

## Future changes

Accounts, analytics, advertising, payments, crash reporting, AI services, remote destination packs, cloud sync, or location would change this policy and store disclosures. Review and publish those changes before enabling such features.

## Contact

`[OWNER DECISION REQUIRED: monitored privacy/support contact]`

For pre-release repository issues, users may use GitHub Issues but should never post personal or sensitive information publicly.
