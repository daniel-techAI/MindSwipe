# Content sourcing and verification

Status: **IMPLEMENTED for the V2 Netherlands pilot.**

## Core rules

1. Every Travel card and place has a stable unique ID.
2. Every Travel card and place has at least one HTTPS source and a `lastVerified` date.
3. Time-sensitive content is explicitly marked.
4. Coordinates and addresses are included only when backed by a location source or official place source.
5. Google Place IDs are omitted unless verified; none are asserted in the pilot.
6. Third-party images require creator credit, license, source URL, alt text, and license URL where applicable.
7. Laws, fines, entry requirements, prices, opening hours, transport rules, safety rules, and changing operational details are omitted unless a current authoritative source and maintenance plan exist.
8. Facts are not generated merely to increase card count.

## Pilot source types

The Netherlands pilot favors:

- official museums and place operators for institutional history;
- UNESCO for World Heritage context;
- national or municipal authorities for infrastructure/history;
- Wikidata location records as secondary verification for coordinates;
- Wikimedia Commons file pages and Creative Commons license pages for images.

Source metadata is visible through compact detail/source affordances rather than filling the primary card face.

## Verification workflow

Before adding or changing Travel content:

1. Define the stable ID and destination level.
2. Identify the exact claim each sentence makes.
3. Prefer a current official/primary source for changing or sensitive claims.
4. Check the source supports the claim, not merely the broad topic.
5. Record the verification date.
6. Set `timeSensitive: true` when information can materially change.
7. Validate address/coordinates independently; do not infer coordinates from an image or place name.
8. Download only permitted images and retain full attribution/license metadata.
9. Run `npm test`, which executes `validateTravelData()` coverage.
10. Manually open rendered source and license links before release.

## Image handling

Pilot image binaries are stored under `public/travel/` and included in offline builds. Attribution remains in `src/travelData.js` and is rendered in place details.

Do not use search-result thumbnails, hotlinked images, unknown-license images, screenshots of maps, or content whose license prohibits the intended distribution.

## Learn content

Legacy Learn cards are bundled editorial content. New V2 AI, science, history, psychology, business, economics, social-skills, and digital-life cards include source name/URL metadata in `src/knowledgeContent.js`. The current Learn card UI does not yet expose those citations. Exposing optional Learn sources is a reasonable future quality improvement, but it is not required for the Travel sourcing contract.

## Review cadence

- Stable history/architecture: review at each destination-pack release or at least annually.
- Operational or time-sensitive information: review before every release and assign a much shorter expiration policy if introduced.
- Broken links and image-license pages: automated link checking is recommended before public scale.

## Takedown/correction process

`[OWNER DECISION REQUIRED]` Add a monitored support email and documented process for factual corrections, attribution fixes, and copyright/licensing concerns before commercial release.
