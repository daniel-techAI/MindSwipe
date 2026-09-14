import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CalendarPlus,
  ExternalLink,
  MapPin,
  Navigation,
  Plus,
  Route,
  Trash2
} from 'lucide-react';
import { buildGoogleMapsRouteSegments, buildWazeNavigationUrl } from './navigationLinks.js';
import { getCities, getDestination, getPlace, getPlacesForDestination } from './travelData.js';
import {
  addTripDay,
  addTripStop,
  moveTripStop,
  removeTripDay,
  removeTripStop,
  renameTripDay,
  reorderTripStop,
  updateTrip,
  updateTripStopNote
} from './trips.js';

function RouteLink({ result, children }) {
  if (!result.supported) return <button type='button' className='routeLink' disabled title={result.reason}><Route size={17} />{children}</button>;
  return <a className='routeLink' href={result.url} target='_blank' rel='noreferrer'><Route size={17} />{children}<ExternalLink size={14} /></a>;
}

function tripStopPlaces(day) {
  return day.stops.map((stop) => getPlace(stop.placeId)).filter(Boolean);
}

export default function TripEditor({ trip, progress, commit, navigate }) {
  const [newDayLabel, setNewDayLabel] = useState('');
  const [placeSelections, setPlaceSelections] = useState({});
  const availablePlaces = useMemo(() => getPlacesForDestination(trip.destinationId), [trip.destinationId]);
  const destination = getDestination(trip.destinationId);

  function saveTrip(nextTrip) {
    commit({
      ...progress,
      trips: progress.trips.map((item) => item.id === trip.id ? nextTrip : item)
    });
  }

  function changeDestination(destinationId) {
    const validPlaceIds = new Set(getPlacesForDestination(destinationId).map((place) => place.id));
    const hasOutsideStops = trip.days.some((day) => day.stops.some((stop) => !validPlaceIds.has(stop.placeId)));
    if (hasOutsideStops && !window.confirm('Changing destination will remove stops outside the new destination. Continue?')) return;
    const days = trip.days.map((day) => ({ ...day, stops: day.stops.filter((stop) => validPlaceIds.has(stop.placeId)) }));
    saveTrip(updateTrip(trip, { destinationId, days }));
  }

  function addStop(dayId) {
    const placeId = placeSelections[dayId] || availablePlaces[0]?.id;
    if (!placeId) return;
    saveTrip(addTripStop(trip, dayId, placeId));
  }

  function createDay(event) {
    event.preventDefault();
    saveTrip(addTripDay(trip, newDayLabel));
    setNewDayLabel('');
  }

  function deleteTrip() {
    if (!window.confirm(`Delete ${trip.title}? This cannot be undone.`)) return;
    commit({ ...progress, trips: progress.trips.filter((item) => item.id !== trip.id) });
    navigate('saved/trips');
  }

  return (
    <section className='tripEditor v2Page' aria-labelledby='trip-title'>
      <header className='tripEditorTop'>
        <button type='button' className='iconOnly' aria-label='Back to trips' onClick={() => navigate('saved/trips')}><ArrowLeft /></button>
        <span>Local trip</span>
        <button type='button' className='iconOnly dangerIcon' aria-label={`Delete ${trip.title}`} onClick={deleteTrip}><Trash2 /></button>
      </header>

      <div className='tripTitleBlock'>
        <label htmlFor='trip-title'>Trip name</label>
        <input id='trip-title' value={trip.title} maxLength='60' onChange={(event) => saveTrip(updateTrip(trip, { title: event.target.value || trip.title }))} />
        <p>{destination?.name || 'Netherlands'} / saved only on this device</p>
      </div>

      <div className='tripControls'>
        <label>Destination
          <select value={trip.destinationId} onChange={(event) => changeDestination(event.target.value)}>
            <option value='country-nl'>Netherlands</option>
            {getCities().map((city) => <option value={city.id} key={city.id}>{city.name}</option>)}
          </select>
        </label>
        <fieldset>
          <legend>Travel mode</legend>
          <div className='segmentControl'>
            {['walking', 'bicycling', 'transit', 'driving'].map((mode) => (
              <button type='button' key={mode} className={trip.travelMode === mode ? 'active' : ''} aria-pressed={trip.travelMode === mode} onClick={() => saveTrip(updateTrip(trip, { travelMode: mode }))}>{mode}</button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className='tripDays'>
        {trip.days.map((day, dayIndex) => {
          const dayPlaces = tripStopPlaces(day);
          const routeSegments = buildGoogleMapsRouteSegments(dayPlaces, trip.travelMode);
          return (
            <section className='tripDay' key={day.id} aria-labelledby={`day-${day.id}`}>
              <div className='tripDayHeader'>
                <input id={`day-${day.id}`} aria-label={`Day ${dayIndex + 1} label`} value={day.label} maxLength='40' onChange={(event) => saveTrip(renameTripDay(trip, day.id, event.target.value))} />
                <span>{day.stops.length} {day.stops.length === 1 ? 'stop' : 'stops'}</span>
                {trip.days.length > 1 ? <button type='button' className='iconOnly' aria-label={`Remove ${day.label}`} onClick={() => saveTrip(removeTripDay(trip, day.id))}><Trash2 size={17} /></button> : null}
              </div>

              <div className='tripStops'>
                {day.stops.map((stop, stopIndex) => {
                  const place = getPlace(stop.placeId);
                  if (!place) return null;
                  const waze = buildWazeNavigationUrl(place);
                  return (
                    <article className='tripStop' key={stop.id}>
                      <div className='stopOrder'>{stopIndex + 1}</div>
                      <div className='stopMain'>
                        <span>{place.category}</span>
                        <strong>{place.name}</strong>
                        <p>{place.address}</p>
                        <textarea aria-label={`Note for ${place.name}`} maxLength='500' placeholder='Add a simple note' value={stop.note} onChange={(event) => saveTrip(updateTripStopNote(trip, day.id, stop.id, event.target.value))} />
                        <div className='stopActions'>
                          <button type='button' className='iconOnly' disabled={stopIndex === 0} aria-label={`Move ${place.name} earlier`} onClick={() => saveTrip(reorderTripStop(trip, day.id, stop.id, -1))}><ArrowUp size={17} /></button>
                          <button type='button' className='iconOnly' disabled={stopIndex === day.stops.length - 1} aria-label={`Move ${place.name} later`} onClick={() => saveTrip(reorderTripStop(trip, day.id, stop.id, 1))}><ArrowDown size={17} /></button>
                          {trip.days.length > 1 ? (
                            <select aria-label={`Move ${place.name} to another day`} value={day.id} onChange={(event) => saveTrip(moveTripStop(trip, day.id, stop.id, event.target.value))}>
                              {trip.days.map((targetDay) => <option key={targetDay.id} value={targetDay.id}>{targetDay.label}</option>)}
                            </select>
                          ) : null}
                          {waze.supported ? <a className='iconOnly' href={waze.url} target='_blank' rel='noreferrer' aria-label={`Navigate to ${place.name} with Waze`}><Navigation size={17} /></a> : null}
                          <button type='button' className='iconOnly dangerIcon' aria-label={`Remove ${place.name}`} onClick={() => saveTrip(removeTripStop(trip, day.id, stop.id))}><Trash2 size={17} /></button>
                        </div>
                      </div>
                    </article>
                  );
                })}
                {!day.stops.length ? <div className='emptyDay'><MapPin size={22} /><p>Add a place to start this day.</p></div> : null}
              </div>

              <div className='addStopRow'>
                <select aria-label={`Place to add to ${day.label}`} value={placeSelections[day.id] || availablePlaces[0]?.id || ''} onChange={(event) => setPlaceSelections((current) => ({ ...current, [day.id]: event.target.value }))}>
                  {availablePlaces.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}
                </select>
                <button type='button' className='iconOnly' disabled={!availablePlaces.length} aria-label={`Add place to ${day.label}`} onClick={() => addStop(day.id)}><Plus /></button>
              </div>

              {routeSegments.length ? (
                <div className='dayRoutes'>
                  <span>Google Maps handoff</span>
                  {routeSegments.map((segment, index) => <RouteLink key={`${segment.start}-${segment.end}`} result={segment}>Open segment {index + 1}: stops {segment.start}-{segment.end}</RouteLink>)}
                  {routeSegments.length > 1 ? <p>The day is split so no stop is silently dropped on mobile Google Maps.</p> : null}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      <form className='addDayForm' onSubmit={createDay}>
        <CalendarPlus size={20} />
        <input aria-label='New day label' maxLength='40' placeholder={`Day ${trip.days.length + 1}`} value={newDayLabel} onChange={(event) => setNewDayLabel(event.target.value)} />
        <button type='submit' className='secondary'>Add day</button>
      </form>
    </section>
  );
}
