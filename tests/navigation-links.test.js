import assert from 'node:assert/strict';
import test from 'node:test';
import { buildGoogleMapsDirectionsUrl, buildGoogleMapsRouteSegments, buildGoogleMapsSearchUrl, buildWazeNavigationUrl, buildWazeSearchUrl } from '../src/navigationLinks.js';

const places = Array.from({ length: 10 }, (_, index) => ({
  id: `place-${index + 1}`,
  name: `Place ${index + 1}`,
  address: `${index + 1} Test Street, Amsterdam, Netherlands`,
  latitude: 52.37 + index / 1000,
  longitude: 4.89 + index / 1000
}));

test('Google Maps search URLs are encoded and use api=1', () => {
  const result = buildGoogleMapsSearchUrl({ name: 'A & B', city: 'Utrecht', country: 'Netherlands' });
  assert.equal(result.supported, true);
  const url = new URL(result.url);
  assert.equal(url.searchParams.get('api'), '1');
  assert.equal(url.searchParams.get('query'), 'A & B, Utrecht, Netherlands');
});

test('Google Maps directions reject oversized single segments', () => {
  assert.equal(buildGoogleMapsDirectionsUrl({ stops: places.slice(0, 5) }).supported, false);
});

test('route segmentation keeps every stop and uses a prior endpoint as the next origin', () => {
  const segments = buildGoogleMapsRouteSegments(places, 'bicycling');
  assert.equal(segments.length, 3);
  assert.deepEqual(segments.flatMap((segment) => segment.placeIds), places.map((place) => place.id));
  const second = new URL(segments[1].url);
  assert.equal(second.searchParams.get('origin'), `${places[3].latitude},${places[3].longitude}`);
});

test('Waze navigation requires coordinates while search accepts an address', () => {
  assert.equal(buildWazeNavigationUrl({ address: 'Dam 1, Amsterdam' }).supported, false);
  assert.equal(buildWazeSearchUrl({ address: 'Dam 1, Amsterdam' }).supported, true);
  const navigation = buildWazeNavigationUrl(places[0]);
  assert.equal(new URL(navigation.url).searchParams.get('navigate'), 'yes');
});
