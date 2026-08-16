export const googleMapsUrlLimit = 2048;
export const portableWaypointLimit = 3;

const travelModes = new Set(['driving', 'walking', 'bicycling', 'transit', 'two-wheeler']);

function validCoordinate(value, min, max) {
  return Number.isFinite(value) && value >= min && value <= max;
}

export function hasCoordinates(place) {
  return validCoordinate(place?.latitude, -90, 90) && validCoordinate(place?.longitude, -180, 180);
}

export function placeQuery(place) {
  if (!place) return '';
  if (hasCoordinates(place)) return `${place.latitude},${place.longitude}`;
  if (place.address) return place.address;
  return [place.name, place.city, place.country].filter(Boolean).join(', ');
}

function safeUrl(url) {
  const value = url.toString();
  return value.length <= googleMapsUrlLimit ? { supported: true, url: value } : { supported: false, reason: 'The route link is longer than Google Maps supports.' };
}

export function buildGoogleMapsSearchUrl(place) {
  const query = placeQuery(place);
  if (!query) return { supported: false, reason: 'This place does not have enough verified location data.' };
  const url = new URL('https://www.google.com/maps/search/');
  url.searchParams.set('api', '1');
  url.searchParams.set('query', query);
  if (place.googlePlaceId) url.searchParams.set('query_place_id', place.googlePlaceId);
  return safeUrl(url);
}

export function buildGoogleMapsDirectionsUrl({ stops, travelMode = 'walking', origin }) {
  const usable = (stops || []).filter((place) => placeQuery(place));
  if (!usable.length) return { supported: false, reason: 'Choose at least one place with verified location data.' };
  if (usable.length > portableWaypointLimit + 1) return { supported: false, reason: 'This segment has too many stops for a portable Google Maps link.' };
  const destination = usable.at(-1);
  const waypoints = usable.slice(0, -1);
  const url = new URL('https://www.google.com/maps/dir/');
  url.searchParams.set('api', '1');
  if (origin && placeQuery(origin)) {
    url.searchParams.set('origin', placeQuery(origin));
    if (origin.googlePlaceId) url.searchParams.set('origin_place_id', origin.googlePlaceId);
  }
  url.searchParams.set('destination', placeQuery(destination));
  if (destination.googlePlaceId) url.searchParams.set('destination_place_id', destination.googlePlaceId);
  if (waypoints.length) {
    url.searchParams.set('waypoints', waypoints.map(placeQuery).join('|'));
    if (waypoints.every((place) => place.googlePlaceId)) url.searchParams.set('waypoint_place_ids', waypoints.map((place) => place.googlePlaceId).join('|'));
  }
  url.searchParams.set('travelmode', travelModes.has(travelMode) ? travelMode : 'walking');
  return safeUrl(url);
}

export function buildGoogleMapsRouteSegments(stops, travelMode = 'walking') {
  const usable = (stops || []).filter((place) => placeQuery(place));
  if (!usable.length) return [];
  const segments = [];
  let offset = 0;
  let origin;
  while (offset < usable.length) {
    const segmentStops = usable.slice(offset, offset + portableWaypointLimit + 1);
    const result = buildGoogleMapsDirectionsUrl({ stops: segmentStops, travelMode, origin });
    segments.push({
      ...result,
      start: offset + 1,
      end: offset + segmentStops.length,
      placeIds: segmentStops.map((place) => place.id)
    });
    origin = segmentStops.at(-1);
    offset += segmentStops.length;
  }
  return segments;
}

export function buildWazeSearchUrl(place) {
  const query = place?.address || [place?.name, place?.city, place?.country].filter(Boolean).join(', ');
  if (!query) return { supported: false, reason: 'This place does not have a verified address or search name.' };
  const url = new URL('https://waze.com/ul');
  url.searchParams.set('q', query);
  return { supported: true, url: url.toString() };
}

export function buildWazeNavigationUrl(place) {
  if (!hasCoordinates(place)) return { supported: false, reason: 'Waze navigation needs verified coordinates for this place.' };
  const url = new URL('https://waze.com/ul');
  url.searchParams.set('ll', `${place.latitude},${place.longitude}`);
  url.searchParams.set('navigate', 'yes');
  return { supported: true, url: url.toString() };
}
