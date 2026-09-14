# Measurement plan

Status: **PLANNED ONLY. No analytics is implemented.**

## Decision gate

Do not add analytics until the owner chooses a stack, defines a lawful/privacy-reviewed basis, updates the public privacy notice and store Data safety form, and decides whether consent is required in launch markets.

## Product questions

- Do users start Explore after seeing it on Home?
- Which pilot destination creates repeat use?
- Do users finish three Travel cards?
- Does curiosity become a saved place, trip, or route launch?
- Does Explore improve or weaken repeat Learn usage?

## Candidate events

| Event | Trigger | Useful parameters |
| --- | --- | --- |
| `onboarding_completed` | Interests saved first time | selected count, pack |
| `explore_opened` | Explore becomes active | entry route |
| `destination_selected` | Manual city selection | destination ID |
| `travel_session_started` | Three-card feed opens | destination ID, category |
| `travel_session_completed` | Third Travel card resolves | destination ID, category |
| `travel_card_saved` | Travel card saved | card ID, destination ID |
| `place_saved` | Place saved | place ID, destination ID |
| `trip_created` | Local trip created | destination ID |
| `route_launched` | Google/Waze link activated | provider, segment size |
| `repeat_destination_usage` | Same destination used on a later date | destination ID |

Avoid recording card bodies, trip titles, notes, exact location, persistent advertising identifiers, or user-entered free text.

## Success funnel

```text
Explore opened
-> destination selected
-> Travel session completed
-> place saved or trip created
-> route launched
-> destination used again
```

## Current local counters

The app stores `learnSessions`, `exploreSessions`, XP, streak, and saved IDs locally for product behavior. They are not telemetry and leave no device.

## Owner decision

`[OWNER DECISION REQUIRED]` Choose one of: no analytics for initial release; privacy-focused aggregate analytics; or a broader product analytics stack. Re-evaluate SDK permissions, network domains, consent, retention, deletion, security, policy, and store declarations before implementation.
