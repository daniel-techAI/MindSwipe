import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  BookOpen,
  Check,
  ChevronRight,
  ExternalLink,
  FolderHeart,
  Map as MapIcon,
  MapPin,
  Navigation,
  Plus,
  Route,
  X
} from 'lucide-react';
import { buildGoogleMapsDirectionsUrl, buildGoogleMapsSearchUrl, buildWazeNavigationUrl, buildWazeSearchUrl } from './navigationLinks.js';
import {
  destinations,
  getCities,
  getDestination,
  getDestinationAncestors,
  getPlace,
  getPlacesForDestination,
  getTravelCards,
  places,
  travelAssetUrl,
  travelCards,
  travelCategories
} from './travelData.js';
import { addTripStop, createTrip } from './trips.js';

function ExternalAction({ result, children, icon: Icon = ExternalLink, className = '' }) {
  if (!result.supported) {
    return <button type='button' className={className} disabled title={result.reason}><Icon size={17} />{children}</button>;
  }
  return <a className={className} href={result.url} target='_blank' rel='noreferrer'><Icon size={17} />{children}</a>;
}

function SourceLinks({ item }) {
  return (
    <div className='sourceList'>
      {item.sources.map((entry) => (
        <a key={entry.url} href={entry.url} target='_blank' rel='noreferrer'>
          <ExternalLink size={14} />
          <span>{entry.name}</span>
        </a>
      ))}
      <span>Verified {item.lastVerified}</span>
      {item.timeSensitive ? <strong>Check current official information before acting.</strong> : null}
    </div>
  );
}

function ImageCredit({ image }) {
  if (!image) return null;
  return (
    <p className='imageCredit'>
      Image: {image.credit}, {image.license}.{' '}
      <a href={image.sourceUrl} target='_blank' rel='noreferrer'>Source</a>
      {image.licenseUrl ? <> / <a href={image.licenseUrl} target='_blank' rel='noreferrer'>License</a></> : null}
    </p>
  );
}

function tripMatchesPlace(trip, place) {
  return getDestinationAncestors(place.destinationId).some((destination) => destination.id === trip.destinationId);
}

function addPlaceToTrip(progress, commit, place, selectedTripId) {
  let trips = progress.trips;
  let trip = trips.find((item) => item.id === selectedTripId && tripMatchesPlace(item, place));
  if (!trip) {
    trip = createTrip({ title: `${place.city} trip`, destinationId: place.destinationId });
    trips = [...trips, trip];
  }
  const nextTrip = addTripStop(trip, trip.days[0].id, place.id);
  commit({ ...progress, trips: trips.map((item) => item.id === trip.id ? nextTrip : item) });
  return nextTrip.id;
}

export function PlaceDetail({ place, progress, commit, onClose, onOpenTrip }) {
  const compatibleTrips = progress.trips.filter((trip) => tripMatchesPlace(trip, place));
  const [tripId, setTripId] = useState(compatibleTrips[0]?.id || 'new');
  const [message, setMessage] = useState('');
  const saved = progress.savedPlaces.includes(place.id);
  const googleSearch = buildGoogleMapsSearchUrl(place);
  const googleDirections = buildGoogleMapsDirectionsUrl({ stops: [place], travelMode: 'walking' });
  const wazeSearch = buildWazeSearchUrl(place);
  const wazeNavigation = buildWazeNavigationUrl(place);
  const related = travelCards.filter((item) => item.placeId === place.id);

  function toggleSaved() {
    const savedPlaces = saved ? progress.savedPlaces.filter((id) => id !== place.id) : [...progress.savedPlaces, place.id];
    commit({ ...progress, savedPlaces });
  }

  function handleAddToTrip() {
    const nextTripId = addPlaceToTrip(progress, commit, place, tripId === 'new' ? '' : tripId);
    setTripId(nextTripId);
    setMessage('Added to Day 1.');
  }

  return (
    <div className='modalBackdrop' role='presentation' onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className='placeSheet' role='dialog' aria-modal='true' aria-labelledby='place-title'>
        <button type='button' className='sheetClose iconOnly' aria-label='Close place details' onClick={onClose}><X /></button>
        <img className='placeHero' src={travelAssetUrl(place.image.src)} alt={place.image.alt} />
        <div className='placeSheetBody'>
          <p className='eyebrow'>{place.city} / {place.category}</p>
          <h2 id='place-title'>{place.name}</h2>
          <p>{place.description}</p>
          <div className='placePrimaryActions'>
            <button type='button' className={saved ? 'compactAction active' : 'compactAction'} onClick={toggleSaved}>
              {saved ? <Check size={17} /> : <Bookmark size={17} />}{saved ? 'Saved' : 'Save place'}
            </button>
            <ExternalAction result={googleSearch} className='compactAction' icon={MapIcon}>Open Maps</ExternalAction>
            <ExternalAction result={googleDirections} className='compactAction' icon={Navigation}>Google route</ExternalAction>
          </div>
          <div className='placeSecondaryActions'>
            <ExternalAction result={wazeSearch} className='textAction' icon={MapPin}>Search Waze</ExternalAction>
            <ExternalAction result={wazeNavigation} className='textAction' icon={Navigation}>Navigate Waze</ExternalAction>
          </div>
          <div className='tripQuickAdd'>
            <label htmlFor={`trip-for-${place.id}`}>Add to trip</label>
            <div>
              <select id={`trip-for-${place.id}`} value={tripId} onChange={(event) => setTripId(event.target.value)}>
                {compatibleTrips.map((trip) => <option key={trip.id} value={trip.id}>{trip.title}</option>)}
                <option value='new'>New {place.city} trip</option>
              </select>
              <button type='button' className='iconOnly' aria-label={`Add ${place.name} to trip`} onClick={handleAddToTrip}><Plus /></button>
            </div>
            {message ? <p role='status'>{message} {onOpenTrip ? <button type='button' className='inlineLink' onClick={() => onOpenTrip(tripId)}>Open trip</button> : null}</p> : null}
          </div>
          {related.length ? (
            <div className='relatedFacts'>
              <span>Related MindSwipes</span>
              {related.map((item) => <p key={item.id}><strong>{item.title}</strong>{item.hook}</p>)}
            </div>
          ) : null}
          <div className='sourcePanel'>
            <strong>Sources</strong>
            <SourceLinks item={place} />
            <ImageCredit image={place.image} />
          </div>
        </div>
      </section>
    </div>
  );
}

export function ExplorePage({ progress, commit, onStartExplore, navigate }) {
  const cities = getCities();
  const activeCity = getDestination(progress.lastDestinationId)?.type === 'city' ? getDestination(progress.lastDestinationId) : cities[0];
  const availableCategories = travelCategories.filter((category) => category === 'Mixed' || getTravelCards(activeCity.id, category).length > 0);
  const activeCategory = availableCategories.includes(progress.travelCategory) ? progress.travelCategory : 'Mixed';
  const feed = getTravelCards(activeCity.id, activeCategory);
  const cityPlaces = getPlacesForDestination(activeCity.id);
  const region = getDestination(activeCity.parentId);
  const [selectedPlace, setSelectedPlace] = useState(null);

  function chooseCity(cityId) {
    commit({ ...progress, lastDestinationId: cityId, travelCategory: 'Mixed' });
  }

  function chooseCategory(category) {
    commit({ ...progress, travelCategory: category });
  }

  return (
    <section className='v2Page explorePage' aria-labelledby='explore-title'>
      <div className='exploreHero'>
        <img src={travelAssetUrl(activeCity.image.src)} alt={activeCity.image.alt} />
        <div className='exploreHeroShade' />
        <div className='exploreHeroContent'>
          <p className='destinationPath'>Netherlands <ChevronRight size={14} /> {region.name} <ChevronRight size={14} /> {activeCity.name}</p>
          <h2 id='explore-title'>{activeCity.name}</h2>
          <p>{activeCity.summary}</p>
          <button type='button' className='exploreStart' onClick={() => onStartExplore(activeCity.id, activeCategory)}>
            <BookOpen size={19} /> Start 3-card explore
          </button>
          <a className='heroImageCredit' href={activeCity.image.sourceUrl} target='_blank' rel='noreferrer'>Photo: {activeCity.image.credit} / {activeCity.image.license}</a>
        </div>
      </div>

      <div className='citySelector' aria-label='Netherlands pilot destinations'>
        {cities.map((city) => (
          <button type='button' key={city.id} className={city.id === activeCity.id ? 'active' : ''} aria-pressed={city.id === activeCity.id} onClick={() => chooseCity(city.id)}>
            <img src={travelAssetUrl(city.image.src)} alt='' />
            <span>{city.name}</span>
          </button>
        ))}
      </div>

      <div className='filterRail' aria-label='Travel card categories'>
        {availableCategories.map((category) => (
          <button type='button' key={category} className={activeCategory === category ? 'active' : ''} aria-pressed={activeCategory === category} onClick={() => chooseCategory(category)}>{category}</button>
        ))}
      </div>

      <div className='exploreSectionHeader'>
        <div><span>Swipe feed</span><h3>{activeCategory === 'Mixed' ? 'A useful mix' : activeCategory}</h3></div>
        <strong>{feed.length} cards</strong>
      </div>
      <div className='factPreviewList'>
        {feed.slice(0, 3).map((item) => (
          <article key={item.id}>
            <span>{item.category}</span>
            <h4>{item.title}</h4>
            <p>{item.hook}</p>
          </article>
        ))}
      </div>

      <div className='exploreSectionHeader placesHeader'>
        <div><span>Save for later</span><h3>Places in {activeCity.name}</h3></div>
        <MapPin size={19} />
      </div>
      <div className='placeGrid'>
        {cityPlaces.map((place) => {
          const saved = progress.savedPlaces.includes(place.id);
          return (
            <article className='placeTile' key={place.id}>
              <button type='button' className='placeImageButton' onClick={() => setSelectedPlace(place)} aria-label={`Open ${place.name} details`}>
                <img src={travelAssetUrl(place.image.src)} alt={place.image.alt} />
              </button>
              <div>
                <span>{place.category}</span>
                <h4>{place.name}</h4>
                <button type='button' className='placeOpen' onClick={() => setSelectedPlace(place)}>Details <ChevronRight size={15} /></button>
                <button type='button' className={saved ? 'placeSave active' : 'placeSave'} aria-label={saved ? `Unsave ${place.name}` : `Save ${place.name}`} onClick={() => commit({ ...progress, savedPlaces: saved ? progress.savedPlaces.filter((id) => id !== place.id) : [...progress.savedPlaces, place.id] })}>
                  {saved ? <Check size={16} /> : <Bookmark size={16} />}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <p className='travelDisclaimer'>Travel information is educational and can become outdated. Verify critical legal, transport, safety, entry, and financial information with current official sources.</p>
      {selectedPlace ? <PlaceDetail place={selectedPlace} progress={progress} commit={commit} onClose={() => setSelectedPlace(null)} onOpenTrip={(id) => navigate(`trip/${id}`)} /> : null}
    </section>
  );
}

function SavedCardDetail({ item, isTravel, move, onClose, onUnsave, onOpenPlace }) {
  return (
    <div className='modalBackdrop' role='presentation' onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className='savedDetailSheet' role='dialog' aria-modal='true' aria-labelledby='saved-card-title'>
        <button type='button' className='sheetClose iconOnly' aria-label='Close card' onClick={onClose}><X /></button>
        <p className='eyebrow'>{isTravel ? `Explore / ${item.category}` : item.area}</p>
        <h2 id='saved-card-title'>{item.title}</h2>
        <strong>{item.hook}</strong>
        <p>{item.body}</p>
        <div className='savedMoveBox'><span>{isTravel ? 'Try this' : 'Tiny move'}</span><p>{move}</p></div>
        {isTravel && item.placeId ? <button type='button' className='secondaryWide' onClick={() => onOpenPlace(item.placeId)}><MapPin size={17} /> View related place</button> : null}
        {isTravel ? <SourceLinks item={item} /> : null}
        <button type='button' className='textAction dangerText' onClick={onUnsave}>Remove from Saved</button>
      </section>
    </div>
  );
}

export function SavedPage({ progress, commit, learnLessons, getLearnMove, view = 'cards', navigate }) {
  const [cardFilter, setCardFilter] = useState('all');
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [tripTitle, setTripTitle] = useState('');
  const [tripDestination, setTripDestination] = useState(progress.lastDestinationId || 'city-amsterdam');
  const cardRegistry = useMemo(() => new Map([...learnLessons, ...travelCards].map((item) => [item.id, item])), [learnLessons]);
  const savedCards = progress.saved.map((id) => cardRegistry.get(id)).filter(Boolean).filter((item) => cardFilter === 'all' || (cardFilter === 'travel') === (item.type === 'travel'));
  const recentCards = progress.recent.map((id) => cardRegistry.get(id)).filter(Boolean);
  const savedPlaceItems = progress.savedPlaces.map(getPlace).filter(Boolean);
  const tabs = [
    { id: 'cards', label: 'Cards', icon: Bookmark },
    { id: 'places', label: 'Places', icon: MapPin },
    { id: 'trips', label: 'Trips', icon: Route },
    { id: 'recent', label: 'Recent', icon: BookOpen }
  ];

  function createNewTrip(event) {
    event.preventDefault();
    if (!tripTitle.trim()) return;
    const trip = createTrip({ title: tripTitle, destinationId: tripDestination });
    commit({ ...progress, trips: [...progress.trips, trip] });
    setTripTitle('');
    navigate(`trip/${trip.id}`);
  }

  function openPlaceFromCard(placeId) {
    setSelectedCard(null);
    setSelectedPlace(getPlace(placeId));
  }

  return (
    <section className='v2Page savedPage' aria-labelledby='saved-title'>
      <div className='pageIntro v2Intro'><span>Your library</span><h2 id='saved-title'>Saved, planned, remembered.</h2></div>
      <div className='savedTabs' role='tablist' aria-label='Saved sections'>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button type='button' key={id} role='tab' aria-selected={view === id} className={view === id ? 'active' : ''} onClick={() => navigate(`saved/${id}`)}><Icon size={17} />{label}</button>
        ))}
      </div>

      {view === 'cards' ? (
        <>
          <div className='filterRail compactFilters' aria-label='Saved card type'>
            {['all', 'learn', 'travel'].map((filter) => <button type='button' key={filter} className={cardFilter === filter ? 'active' : ''} onClick={() => setCardFilter(filter)}>{filter[0].toUpperCase() + filter.slice(1)}</button>)}
          </div>
          <div className='libraryList'>
            {savedCards.map((item) => (
              <button type='button' key={item.id} onClick={() => setSelectedCard(item)}>
                <span>{item.type === 'travel' ? `Explore / ${item.category}` : `Learn / ${item.area}`}</span>
                <strong>{item.title}</strong>
                <p>{item.hook}</p>
                <ChevronRight size={18} />
              </button>
            ))}
            {!savedCards.length ? <div className='emptyState'><FolderHeart size={26} /><strong>No saved cards in this view</strong><p>Swipe left during Learn or Explore to keep a card here.</p></div> : null}
          </div>
        </>
      ) : null}

      {view === 'places' ? (
        <div className='libraryList placeLibrary'>
          {savedPlaceItems.map((place) => (
            <button type='button' key={place.id} onClick={() => setSelectedPlace(place)}>
              <img src={travelAssetUrl(place.image.src)} alt='' />
              <span>{place.city}</span><strong>{place.name}</strong><p>{place.category}</p><ChevronRight size={18} />
            </button>
          ))}
          {!savedPlaceItems.length ? <div className='emptyState'><MapPin size={26} /><strong>No saved places yet</strong><p>Save a place from Explore and it will appear here.</p></div> : null}
        </div>
      ) : null}

      {view === 'trips' ? (
        <>
          <form className='tripCreate' onSubmit={createNewTrip}>
            <label htmlFor='new-trip-title'>Create a trip</label>
            <input id='new-trip-title' value={tripTitle} maxLength='60' placeholder='Trip name' onChange={(event) => setTripTitle(event.target.value)} />
            <select aria-label='Trip destination' value={tripDestination} onChange={(event) => setTripDestination(event.target.value)}>
              <option value='country-nl'>Netherlands</option>
              {getCities().map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
            </select>
            <button type='submit' className='primaryWide' disabled={!tripTitle.trim()}><Plus size={18} />Create trip</button>
          </form>
          <div className='tripList'>
            {progress.trips.map((trip) => {
              const stopCount = trip.days.reduce((total, day) => total + day.stops.length, 0);
              return (
                <button type='button' key={trip.id} onClick={() => navigate(`trip/${trip.id}`)}>
                  <Route size={21} /><span>{getDestination(trip.destinationId)?.name || 'Netherlands'}</span><strong>{trip.title}</strong><p>{trip.days.length} {trip.days.length === 1 ? 'day' : 'days'} / {stopCount} {stopCount === 1 ? 'stop' : 'stops'}</p><ChevronRight size={18} />
                </button>
              );
            })}
          </div>
        </>
      ) : null}

      {view === 'recent' ? (
        <div className='libraryList'>
          {recentCards.map((item) => (
            <button type='button' key={item.id} onClick={() => setSelectedCard(item)}>
              <span>{item.type === 'travel' ? `Explore / ${item.category}` : `Learn / ${item.area}`}</span><strong>{item.title}</strong><p>{item.hook}</p><ChevronRight size={18} />
            </button>
          ))}
          {!recentCards.length ? <div className='emptyState'><BookOpen size={26} /><strong>No recent cards yet</strong><p>Complete a Learn or Explore swipe to build your trail.</p></div> : null}
        </div>
      ) : null}

      {selectedCard ? <SavedCardDetail item={selectedCard} isTravel={selectedCard.type === 'travel'} move={selectedCard.type === 'travel' ? selectedCard.action : getLearnMove(selectedCard)} onClose={() => setSelectedCard(null)} onUnsave={() => { commit({ ...progress, saved: progress.saved.filter((id) => id !== selectedCard.id) }); setSelectedCard(null); }} onOpenPlace={openPlaceFromCard} /> : null}
      {selectedPlace ? <PlaceDetail place={selectedPlace} progress={progress} commit={commit} onClose={() => setSelectedPlace(null)} onOpenTrip={(id) => navigate(`trip/${id}`)} /> : null}
    </section>
  );
}

export { destinations, places };
