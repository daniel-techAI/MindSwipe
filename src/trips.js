const maxTitleLength = 60;
const maxLabelLength = 40;
const maxNoteLength = 500;

function cleanText(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function editableText(value, maxLength) {
  return typeof value === 'string' ? value.slice(0, maxLength) : '';
}

function defaultId(prefix) {
  const value = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${value}`;
}

export function normalizeTripStop(value) {
  if (!value || typeof value !== 'object' || typeof value.placeId !== 'string' || !value.placeId) return null;
  return {
    id: cleanText(value.id, 120) || defaultId('stop'),
    placeId: cleanText(value.placeId, 120),
    note: editableText(value.note, maxNoteLength)
  };
}

export function normalizeTripDay(value, index = 0) {
  if (!value || typeof value !== 'object') return null;
  const stops = Array.isArray(value.stops) ? value.stops.map(normalizeTripStop).filter(Boolean) : [];
  const label = editableText(value.label, maxLabelLength);
  return {
    id: cleanText(value.id, 120) || defaultId('day'),
    label: label.trim() ? label : `Day ${index + 1}`,
    stops
  };
}

export function normalizeTrip(value) {
  if (!value || typeof value !== 'object') return null;
  const title = editableText(value.title, maxTitleLength);
  const destinationId = cleanText(value.destinationId || value.destination, 120);
  if (!title.trim() || !destinationId) return null;
  const createdAt = typeof value.createdAt === 'string' ? value.createdAt : new Date().toISOString();
  const days = Array.isArray(value.days) ? value.days.map(normalizeTripDay).filter(Boolean) : [];
  return {
    id: cleanText(value.id, 120) || defaultId('trip'),
    title,
    destinationId,
    travelMode: ['walking', 'bicycling', 'transit', 'driving'].includes(value.travelMode) ? value.travelMode : 'walking',
    createdAt,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : createdAt,
    days: days.length ? days : [{ id: defaultId('day'), label: 'Day 1', stops: [] }]
  };
}

export function normalizeTrips(value) {
  return Array.isArray(value) ? value.map(normalizeTrip).filter(Boolean) : [];
}

export function createTrip({ title, destinationId, now = new Date().toISOString(), idFactory = defaultId }) {
  const cleanTitle = cleanText(title, maxTitleLength);
  const cleanDestination = cleanText(destinationId, 120);
  if (!cleanTitle || !cleanDestination) throw new Error('A trip title and destination are required.');
  return {
    id: idFactory('trip'),
    title: cleanTitle,
    destinationId: cleanDestination,
    travelMode: 'walking',
    createdAt: now,
    updatedAt: now,
    days: [{ id: idFactory('day'), label: 'Day 1', stops: [] }]
  };
}

export function updateTrip(trip, changes, now = new Date().toISOString()) {
  const next = {
    ...trip,
    ...changes,
    title: changes.title === undefined ? trip.title : cleanText(changes.title, maxTitleLength),
    updatedAt: now
  };
  return normalizeTrip(next) || trip;
}

export function addTripDay(trip, label, { now = new Date().toISOString(), idFactory = defaultId } = {}) {
  const day = {
    id: idFactory('day'),
    label: cleanText(label, maxLabelLength) || `Day ${trip.days.length + 1}`,
    stops: []
  };
  return updateTrip(trip, { days: [...trip.days, day] }, now);
}

export function renameTripDay(trip, dayId, label, now) {
  const nextLabel = editableText(label, maxLabelLength);
  if (!nextLabel.trim()) return trip;
  return updateTrip(trip, { days: trip.days.map((day) => day.id === dayId ? { ...day, label: nextLabel } : day) }, now);
}

export function removeTripDay(trip, dayId, now) {
  if (trip.days.length <= 1) return trip;
  const removed = trip.days.find((day) => day.id === dayId);
  const remaining = trip.days.filter((day) => day.id !== dayId);
  if (!removed) return trip;
  remaining[0] = { ...remaining[0], stops: [...remaining[0].stops, ...removed.stops] };
  return updateTrip(trip, { days: remaining }, now);
}

export function addTripStop(trip, dayId, placeId, { note = '', now = new Date().toISOString(), idFactory = defaultId } = {}) {
  if (!trip.days.some((day) => day.id === dayId) || !placeId) return trip;
  const stop = { id: idFactory('stop'), placeId, note: cleanText(note, maxNoteLength) };
  return updateTrip(trip, {
    days: trip.days.map((day) => day.id === dayId ? { ...day, stops: [...day.stops, stop] } : day)
  }, now);
}

export function removeTripStop(trip, dayId, stopId, now) {
  return updateTrip(trip, {
    days: trip.days.map((day) => day.id === dayId ? { ...day, stops: day.stops.filter((stop) => stop.id !== stopId) } : day)
  }, now);
}

export function updateTripStopNote(trip, dayId, stopId, note, now) {
  return updateTrip(trip, {
    days: trip.days.map((day) => day.id === dayId ? {
      ...day,
      stops: day.stops.map((stop) => stop.id === stopId ? { ...stop, note: editableText(note, maxNoteLength) } : stop)
    } : day)
  }, now);
}

export function reorderTripStop(trip, dayId, stopId, direction, now) {
  const days = trip.days.map((day) => {
    if (day.id !== dayId) return day;
    const index = day.stops.findIndex((stop) => stop.id === stopId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= day.stops.length) return day;
    const stops = [...day.stops];
    [stops[index], stops[target]] = [stops[target], stops[index]];
    return { ...day, stops };
  });
  return updateTrip(trip, { days }, now);
}

export function moveTripStop(trip, fromDayId, stopId, toDayId, now) {
  const source = trip.days.find((day) => day.id === fromDayId);
  const stop = source?.stops.find((item) => item.id === stopId);
  if (!stop || !trip.days.some((day) => day.id === toDayId) || fromDayId === toDayId) return trip;
  return updateTrip(trip, {
    days: trip.days.map((day) => {
      if (day.id === fromDayId) return { ...day, stops: day.stops.filter((item) => item.id !== stopId) };
      if (day.id === toDayId) return { ...day, stops: [...day.stops, stop] };
      return day;
    })
  }, now);
}
