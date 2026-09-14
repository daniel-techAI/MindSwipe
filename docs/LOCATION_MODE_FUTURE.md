# Optional location mode - future design only

Status: **NOT IMPLEMENTED. No location permission exists in V2.**

## Possible experience

An explicit **Use my location** action could offer nearby knowledge and places. Manual Explore must remain fully functional when location is unavailable, denied, approximate, or revoked.

## Permission model

- Ask only after the user taps the location action.
- Explain the immediate benefit before the system prompt.
- Prefer foreground and approximate location where sufficient.
- Do not request background location for nearby discovery.
- Never enable silent tracking, geofencing, or continuous polling by default.
- Make denial recoverable with manual destination selection.

## Architecture fit

The current destination/place model already contains city relationships and verified coordinates. A future adapter can accept a one-time coordinate, compute nearby candidates locally or through a deliberately selected service, and return destination/place IDs to existing Explore views.

If a remote nearby search is used, document the provider, request contents, retention, API key handling, regional transfer, cost limits, caching, and failure behavior. Do not expose provider keys in the web bundle.

## Required work before implementation

- `[OWNER DECISION REQUIRED]` Confirm the feature solves a validated user problem.
- Product copy and denial/settings recovery flow.
- Android/iOS permission and store disclosure review.
- Privacy-policy and Data safety updates.
- Threat model for precise/approximate coordinates.
- Tests for denied, unavailable, stale, inaccurate, and offline location.
- Real-device battery and lifecycle testing.
