# Policy and terms research record

Last verified: 2026-09-02

Status: **SOURCE RECORD, NOT LEGAL ADVICE OR A COMPLIANCE CERTIFICATE.**

## Method

The public MindSwipe Privacy Policy and Terms were written for the behavior verified in this repository. Comparable apps were used only to identify common document sections and product risks. Their wording was not copied, and their broader data practices were not attributed to MindSwipe.

## Primary sources

- Google Play User Data policy: https://support.google.com/googleplay/android-developer/answer/10144311
- Google Play Data safety form guidance: https://support.google.com/googleplay/android-developer/answer/10787469
- Google Play target API requirements: https://developer.android.com/google/play/requirements/target-sdk
- Android app signing: https://developer.android.com/studio/publish/app-signing
- Google Play App Signing: https://support.google.com/googleplay/android-developer/answer/9842756
- Google Play internal testing: https://support.google.com/googleplay/android-developer/answer/9845334
- Google Play developer contact requirements: https://support.google.com/googleplay/android-developer/answer/13634081
- European Commission GDPR principles: https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/principles-gdpr_en
- GitHub Privacy Statement: https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement
- Google Privacy Policy for Gmail-hosted support: https://policies.google.com/privacy

## Comparable product structure reviewed

- Headway Privacy Policy: https://makeheadway.com/privacy-policy/
- Headway Terms and Conditions: https://makeheadway.com/terms-and-conditions/
- Blinkist Terms of Service: https://www.blinkist.com/en/tos

Headway and Blinkist use accounts, subscriptions, analytics, advertising, personalization, or other services that MindSwipe V2 does not currently implement. Those sections were deliberately excluded rather than copied into an inaccurate policy.

## Repository facts used

- localStorage persistence and migration in `src/progress.js`;
- local trip and note handling in `src/trips.js` and related views;
- explicit Google Maps and Waze links in `src/navigationLinks.js`;
- local notification scheduling in `src/App.jsx`;
- permissions and backup/cleartext settings in the Android manifest;
- no analytics, ads, payment, account, remote database, AI, or location SDK in `package.json` and Android dependencies;
- GitHub Pages hosting and public legal/support pages in the deployment workflow and `public/`.

## Re-review triggers

Re-run the policy review before shipping accounts, cloud sync, analytics, crash reporting, ads, payments, remote content packs, AI requests, location, new permissions, a new support provider, a new legal operator, a paid product, or additional launch countries.
