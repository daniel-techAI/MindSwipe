import assert from 'node:assert/strict';
import test from 'node:test';
import { destinations, getCities, getPlacesForDestination, getTravelCards, places, travelCards, validateTravelData } from '../src/travelData.js';

test('Netherlands pilot has the intended scalable hierarchy and inventory', () => {
  assert.equal(destinations.filter((item) => item.type === 'country').length, 1);
  assert.equal(destinations.filter((item) => item.type === 'region').length, 3);
  assert.deepEqual(getCities().map((item) => item.name), ['Amsterdam', 'Utrecht', 'Rotterdam']);
  assert.equal(places.length, 12);
  assert.equal(travelCards.length, 24);
  assert.deepEqual(validateTravelData(), []);
});

test('city feeds inherit country and region cards deterministically', () => {
  const cards = getTravelCards('city-amsterdam');
  assert.equal(cards.length, 10);
  assert.deepEqual(cards, getTravelCards('city-amsterdam'));
  assert.ok(cards.some((item) => item.destinationId === 'country-nl'));
  assert.ok(cards.some((item) => item.destinationId === 'region-north-holland'));
  assert.ok(cards.some((item) => item.destinationId === 'city-amsterdam'));
});

test('travel category and destination filters do not leak other cities', () => {
  const architecture = getTravelCards('city-rotterdam', 'Architecture');
  assert.ok(architecture.length > 0);
  assert.ok(architecture.every((item) => item.category === 'Architecture'));
  assert.ok(architecture.every((item) => item.destinationId !== 'city-amsterdam'));
  assert.equal(getPlacesForDestination('city-utrecht').length, 4);
  assert.equal(getPlacesForDestination('country-nl').length, 12);
  assert.deepEqual(getPlacesForDestination('missing'), []);
  assert.deepEqual(getTravelCards('missing'), []);
});
