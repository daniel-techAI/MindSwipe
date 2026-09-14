# Travel mode

Status: **COMPLETE for the Netherlands pilot; broader coverage is NOT IMPLEMENTED.**

Last implementation review: 2026-08-16

## Product purpose

Explore uses MindSwipe's short-card interaction to create curiosity about a real destination, then directs the user toward a place, a saved plan, or an external navigation app. It is not a generic booking, map, review, or itinerary marketplace.

## Pilot

The bundled hierarchy is:

```text
Netherlands
|-- North Holland
|   `-- Amsterdam
|-- Utrecht
|   `-- Utrecht
`-- South Holland
    `-- Rotterdam
```

Inventory:

- 24 Travel cards across country, region, and city levels.
- 12 places, four per city.
- Bundled attributed images for every pilot place.
- Categories supported by the model: History, Culture, Architecture, Etiquette, Food, Language, Useful, Places, and Misconceptions.

Category feeds inherit relevant country and region knowledge. When a selected category has fewer than three cards, the session starts with that category and fills the remaining slots from the destination's mixed feed without duplicates.

## User flow

```text
Explore
-> choose Amsterdam, Utrecht, or Rotterdam
-> choose Mixed or a category
-> swipe three sourced cards
-> save a card or finish it
-> inspect/save a related place
-> add place to a local trip
-> launch a supported Google Maps or Waze action
```

Explore contributes to the shared XP/streak after three cards. It intentionally has no quiz in V2.

## Place actions

- **Save place:** writes the stable place ID to local progress.
- **Add to trip:** adds a stop to a compatible trip or creates a city trip.
- **Open Maps:** Google Maps search using verified coordinates/address.
- **Google route:** directions to one place.
- **Search Waze:** universal Waze query URL.
- **Navigate Waze:** universal Waze deep link using verified coordinates.
- **Related MindSwipes:** place-linked Travel cards in the detail sheet.

Buttons are disabled when the underlying place lacks sufficient location data. Missing data is not guessed.

## Trips

Trips support local creation, title, destination, travel mode, days, day labels, place stops, notes, stop removal, within-day reordering, moving a stop to another day, and reopening after reload.

Route handoff is per day. Google Maps mobile links have a conservative three-waypoint limit and a 2,048-character URL limit. A longer day becomes multiple explicit segments. A segment starts from the previous segment's endpoint where required, preserving every stop.

Waze receives only an individual destination/next stop. MindSwipe does not claim that Waze imports a full itinerary.

## Offline

All pilot data and images are bundled and precached. Users can browse Travel cards, save places, and edit trips offline. External sources and navigation links need network access and the corresponding external service.

## Not implemented

- Worldwide or dynamically downloaded destination coverage.
- GPS, nearby discovery, geofencing, background location, or location-triggered reminders.
- Hotels, bookings, prices, opening-hour feeds, live transport, safety alerts, or entry rules.
- Reviews, social sharing, collaborative trips, cloud sync, or accounts.
- Embedded maps or turn-by-turn navigation.
- Direct insertion into a Google Maps Saved collection.

## Future destination packs

A future pack can use the same validated schema and local asset layout. A remote pack system would require signed/versioned manifests, download integrity, cache quotas, update/expiry policy, deletion controls, source/license review, offline failure handling, privacy review, and tests. It should not be built until pilot retention demonstrates demand.

## Travel disclaimer

Travel information in MindSwipe is informational and educational. It can become outdated. Users should verify critical legal, transport, safety, entry, health, and financial information through current official sources before acting. The app should still provide useful stable context rather than hiding behind a blanket disclaimer.
