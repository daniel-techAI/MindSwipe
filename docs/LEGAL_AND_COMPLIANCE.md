# Legal and compliance preparation

Status: **TECHNICAL DRAFT ONLY. This document does not claim legal compliance or provide legal advice.**

Last updated: 2026-08-16

## Owner information

- Publisher/operator: `[OWNER DECISION REQUIRED]`
- Legal form/registration: `[OWNER DECISION REQUIRED]`
- Country and business address requirements: `[OWNER DECISION REQUIRED]`
- Monitored support email: `[OWNER DECISION REQUIRED]`
- Privacy-policy URL: `[OWNER DECISION REQUIRED]`
- Terms URL: `[OWNER DECISION REQUIRED]`

## Current technical facts

- No account, remote profile, backend, analytics, ad SDK, payment SDK, Firebase, cloud sync, or GPS.
- Learn progress, Saved items, trips, free-text trip notes, and preferences remain in local storage.
- Android local notifications are opt-in. Exact timing opens the Android exact-alarm setting only after explicit selection.
- External requests occur only when serving the app or when the user opens a source, image-license, Google Maps, Waze, privacy, or support link.
- Android cloud backup and cleartext traffic are disabled.
- Bundled third-party images carry attribution/license metadata.

These facts must be revalidated against the signed release artifact and dependency graph before every store declaration.

## Documents and surfaces

- In-app/public privacy page: `public/privacy.html`.
- Maintainer privacy draft: `docs/PRIVACY_POLICY_DRAFT.md`.
- Terms draft: `docs/TERMS_OF_USE_DRAFT.md`.
- Sourcing rules: `docs/CONTENT_SOURCING.md`.
- Travel limitations: `docs/TRAVEL_MODE.md`.
- Store preparation: `docs/PLAY_STORE_PREP.md`.

## Travel information

MindSwipe should state that Travel content is informational/educational and can become outdated. Critical legal, transport, safety, entry, health, and financial information must be verified with current official sources. This limitation should not be used to justify low-quality or unsourced content.

## Content and image rights

- Maintain source and verification metadata per Travel item.
- Preserve image creator, source, license, and license-link metadata.
- Verify that app distribution and marketing use comply with each license, including attribution and share-alike requirements where applicable.
- Provide a monitored correction/takedown route before commercial launch.
- Do not add fake reviews, testimonials, ratings, endorsements, or partner logos.

## Google Play declarations

Human completion is required for:

- developer/publisher identity verification;
- Data safety form based on the release artifact;
- target audience and content rating;
- ads declaration;
- app access instructions if later required;
- privacy-policy URL;
- exact-alarm permission eligibility/policy review;
- store listing, screenshots, icon, feature graphic, and support contact;
- internal/closed testing and production access requirements.

## Regional/legal questions

`[OWNER DECISION REQUIRED]` Identify launch countries. The owner should obtain qualified advice where required concerning consumer terms, operator disclosures, age/children rules, intellectual property, electronic communications, accessibility, tax/VAT, and business registration.

## Monetization gate

No monetization code exists. Before adding paid destination packs, one-time unlocks, or subscriptions, perform a fresh review of Google Play Billing requirements, refunds/cancellation, pricing disclosures, tax/VAT, consumer withdrawal rights, operator registration, support, privacy, and store forms.

## Release rule

Technical preparation is not legal approval. Do not mark a release compliant solely because these drafts exist or a debug build installs.
