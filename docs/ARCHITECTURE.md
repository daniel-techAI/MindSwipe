# MindSwipe V2 architecture

Last verified against code: 2026-08-16

## System map

```text
Bundled Learn + Travel data
            |
            v
React 19 / Vite UI ---> versioned progress state ---> localStorage
      |                         |
      |                         +-- saved cards and places
      |                         +-- trips, days, stops, notes
      |                         +-- XP, streak, recent and completed IDs
      |
      +-- service worker ---> cached production bundle / offline shell
      +-- Capacitor 8 -----> haptics + local notifications
      +-- user action -----> Google Maps / Waze / source URLs
```

There is no application server, remote database, account, authentication, analytics, ad network, payment system, or AI API.

## Product routing

The app uses client-side hash routes so deep navigation remains compatible with static GitHub project Pages and Capacitor:

- `#/home`
- `#/learn`
- `#/explore`
- `#/saved/cards`
- `#/saved/places`
- `#/saved/trips`
- `#/saved/recent`
- `#/trip/:id`
- `#/profile`
- `#/profile/quote`
- `#/profile/settings`

Tutorial, onboarding, sessions, quiz, retry, and completion are controlled transient screens above those routes. Browser back/forward listens for hash and history changes.

## Sources of truth

- `src/App.jsx`: orchestration, Learn selection, session interaction, quote selection, reminder behavior, and route shell.
- `src/progress.js`: persistent schema, migration, normalization, backups, and shared completion/streak behavior.
- `src/content.js`, `src/quoteBank.js`, `src/knowledgeContent.js`: Learn and quote content.
- `src/travelData.js`: destination hierarchy, sourced Travel cards, places, and image attribution.
- `src/TravelViews.jsx`: Explore, Saved, and place-detail presentation.
- `src/trips.js`, `src/TripEditor.jsx`: trip domain operations and editor.
- `src/navigationLinks.js`: official URL handoff construction and route segmentation.
- `scripts/create-service-worker.mjs`: generated offline cache from the actual production build.
- `capacitor.config.json`, `android/`: native application boundary.

## Content models

Travel cards carry stable IDs, destination hierarchy references, category, hook/body/action, tags, sources, verification date, time-sensitivity status, and optional related place.

Places carry stable IDs, country/region/city, verified address and coordinates, category/tags, description, sources, verification date, and bundled image credit/license metadata. Google Place IDs are omitted where none were verified.

Trips are local-first:

```json
{
  "id": "trip-uuid",
  "title": "Netherlands week",
  "destinationId": "country-nl",
  "travelMode": "walking",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp",
  "days": [
    {
      "id": "day-uuid",
      "label": "Day 1",
      "stops": [
        { "id": "stop-uuid", "placeId": "place-id", "note": "" }
      ]
    }
  ]
}
```

## Persistence and migration

The key is `mindSwipeProgress`; schema version is `2`.

`readProgress()`:

1. parses the stored record;
2. normalizes types, arrays, valid modes, trip structure, and defaults;
3. stores the original V1 payload once under `mindSwipeProgressBackupV1` before migration;
4. stores malformed raw data once under `mindSwipeProgressCorrupt` and recovers with a valid default.

`saveProgress()` always normalizes before writing. Reset removes the active record and both local backups. Existing Learn IDs, XP, streak, completed/saved/recent records, and reminder preferences are preserved during migration.

## Shared progress rule

Learn and Explore use the same XP, streak, saved-card collection, recent list, and completion IDs. Learn requires its answer check. Explore completes after three cards with no quiz. Completion counters separately record `learnSessions` and `exploreSessions` for local product behavior, not telemetry.

Streak rules use local calendar dates:

- same day: streak is not incremented;
- previous calendar day: streak increments;
- longer gap: streak restarts at 1.

## Offline behavior

Vite builds `dist/`. The service-worker generator hashes and precaches every production file except the worker itself. This includes app code, fonts/assets already in the build, travel data, and bundled travel images. Navigation falls back to cached `index.html` within the current project base path.

External citations, image-license pages, Google Maps, Waze, and GitHub support require connectivity. No remote cache/pack service exists.

## Maps boundary

MindSwipe owns discovery, saving, and itinerary organization. It does not render a map or provide turn-by-turn navigation.

- Google Maps links use `https://www.google.com/maps/search/` or `/dir/` with `api=1` and URL-encoded parameters.
- A portable segment contains no more than three waypoints plus its destination and remains under 2,048 characters.
- Longer days are divided into labeled segments; stops are never silently dropped.
- Waze uses `https://waze.com/ul`, search queries, or verified latitude/longitude for one destination.

## Android boundary

- Capacitor 8 wraps `dist/`.
- Application ID: `com.mindswipe.app`.
- Minimum SDK: 24.
- Compile/target SDK: 36.
- Permissions: internet, post notifications, schedule exact alarm.
- Explicitly absent: location, contacts, camera, microphone, storage, advertising ID.
- Android backup and cleartext traffic are disabled.

The exact-alarm settings screen is opened only after the user selects exact delivery. Flexible background notifications do not set `allowWhileIdle`.

## Maintainability boundary

The root component remains responsible for the established Learn/session flow. Explore/Saved and trip editing were extracted because they form distinct domains. Further refactoring should be driven by testability or real complexity, not folder aesthetics.

Areas that should not change casually:

- stable content and place IDs;
- `mindSwipeProgress` migration behavior;
- relative Vite/PWA base path;
- permission list;
- route-segmentation limits;
- local-only trust boundary.
