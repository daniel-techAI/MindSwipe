import assert from 'node:assert/strict';
import test from 'node:test';
import { addTripDay, addTripStop, createTrip, moveTripStop, removeTripStop, reorderTripStop, updateTrip, updateTripStopNote } from '../src/trips.js';

function ids() {
  let value = 0;
  return (prefix) => `${prefix}-${++value}`;
}

test('creates and edits a local trip without mutating previous values', () => {
  const idFactory = ids();
  const trip = createTrip({ title: 'Netherlands week', destinationId: 'country-nl', now: '2026-08-16T12:00:00.000Z', idFactory });
  const withDay = addTripDay(trip, 'Rotterdam', { now: '2026-08-16T12:01:00.000Z', idFactory });
  const firstStop = addTripStop(withDay, withDay.days[0].id, 'place-rijksmuseum', { idFactory });
  const secondStop = addTripStop(firstStop, firstStop.days[0].id, 'place-canal-ring', { idFactory });
  const reordered = reorderTripStop(secondStop, secondStop.days[0].id, secondStop.days[0].stops[1].id, -1);
  assert.equal(reordered.days[0].stops[0].placeId, 'place-canal-ring');
  assert.equal(trip.days.length, 1);

  const moved = moveTripStop(reordered, reordered.days[0].id, reordered.days[0].stops[0].id, reordered.days[1].id);
  assert.equal(moved.days[1].stops.length, 1);
  const noted = updateTripStopNote(moved, moved.days[1].id, moved.days[1].stops[0].id, 'Morning visit ');
  assert.equal(noted.days[1].stops[0].note, 'Morning visit ');
  const removed = removeTripStop(noted, noted.days[1].id, noted.days[1].stops[0].id);
  assert.equal(removed.days[1].stops.length, 0);
});

test('rejects a blank title without deleting the trip', () => {
  const trip = createTrip({ title: 'Amsterdam weekend', destinationId: 'city-amsterdam', idFactory: ids() });
  const result = updateTrip(trip, { title: '   ' }, '2026-08-16T12:00:00.000Z');

  assert.equal(result.id, trip.id);
  assert.equal(result.title, 'Amsterdam weekend');
});
