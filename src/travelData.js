const verifiedOn = '2026-08-16';

const source = (name, url) => ({ name, url });

const imageCredits = {
  canals: {
    src: 'travel/amsterdam-canal-ring.jpg',
    alt: 'Aerial view of Amsterdam canals and narrow canal houses',
    credit: 'Swimmerguy269',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Amsterdam_Aerial.jpg'
  },
  rijksmuseum: {
    src: 'travel/rijksmuseum.jpg',
    alt: 'The Rijksmuseum facade in Amsterdam',
    credit: 'Marco Almbauer',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rijksmuseum_in_Amsterdam.jpg'
  },
  anneFrankHouse: {
    src: 'travel/anne-frank-house.jpg',
    alt: 'Canal houses beside the Anne Frank House in Amsterdam',
    credit: 'Jose A.',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Amsterdam_(Paises_Bajos)_(15316045410).jpg'
  },
  nemo: {
    src: 'travel/nemo-science-museum.jpg',
    alt: 'The copper-green NEMO Science Museum above the Oosterdok',
    credit: 'Gamekeeper',
    license: 'Public domain',
    licenseUrl: null,
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:NEMO_(Amsterdam).jpg'
  },
  domTower: {
    src: 'travel/dom-tower.jpg',
    alt: 'The Dom Tower rising above central Utrecht',
    credit: 'Massimo Catarinella',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:DomTorenUtrechtNederland.jpg'
  },
  rietveld: {
    src: 'travel/rietveld-schroder-house.jpg',
    alt: 'The geometric facade of the Rietveld Schroder House',
    credit: 'Hay Kranen',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rietveld_Schr%C3%B6derhuis_HayKranen-20.JPG'
  },
  oudegracht: {
    src: 'travel/oudegracht.jpg',
    alt: 'Aerial view of the Oudegracht and central Utrecht',
    credit: 'Diliff',
    license: 'CC BY 2.5',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.5',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Utrecht_Canals_Aerial_View_-_July_2006.jpg'
  },
  railwayMuseum: {
    src: 'travel/railway-museum.jpg',
    alt: 'Historic trains at the Railway Museum in Utrecht',
    credit: 'Marion Golsteijn',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Spoorwegmuseum_Utrecht_003.JPG'
  },
  markthal: {
    src: 'travel/markthal.jpg',
    alt: 'The arched Markthal building in Rotterdam',
    credit: 'Exmpletree',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Markthal-Rotterdam.jpg'
  },
  cubeHouses: {
    src: 'travel/cube-houses.jpg',
    alt: 'Rotterdam Cube Houses tilted above their columns',
    credit: 'W. Bulach',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:01_Rotterdam_-_Kubushaus.jpg'
  },
  depot: {
    src: 'travel/depot-boijmans.jpg',
    alt: 'The mirrored bowl-shaped Depot Boijmans Van Beuningen',
    credit: 'Rob Oo',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Skylines_and_curves.jpg'
  },
  erasmusBridge: {
    src: 'travel/erasmus-bridge.jpg',
    alt: 'The Erasmus Bridge spanning the Nieuwe Maas in Rotterdam',
    credit: 'F. Eveleens',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rotterdam_erasmusbrug.jpg'
  }
};

export const travelCategories = ['Mixed', 'History', 'Culture', 'Architecture', 'Etiquette', 'Food', 'Language', 'Useful', 'Places', 'Misconceptions'];

export const destinations = [
  { id: 'country-nl', type: 'country', parentId: null, countryCode: 'NL', name: 'Netherlands', summary: 'Water-shaped cities, practical design, and compact journeys.', image: imageCredits.canals },
  { id: 'region-north-holland', type: 'region', parentId: 'country-nl', countryCode: 'NL', name: 'North Holland', summary: 'Canals, trade history, museums, and Amsterdam.', image: imageCredits.canals },
  { id: 'city-amsterdam', type: 'city', parentId: 'region-north-holland', countryCode: 'NL', name: 'Amsterdam', summary: 'Read the canal city through water, memory, art, and science.', image: imageCredits.canals },
  { id: 'region-utrecht', type: 'region', parentId: 'country-nl', countryCode: 'NL', name: 'Utrecht', summary: 'A central province with Roman roots and radical design.', image: imageCredits.oudegracht },
  { id: 'city-utrecht', type: 'city', parentId: 'region-utrecht', countryCode: 'NL', name: 'Utrecht', summary: 'A medieval canal city built at two levels.', image: imageCredits.oudegracht },
  { id: 'region-south-holland', type: 'region', parentId: 'country-nl', countryCode: 'NL', name: 'South Holland', summary: 'Delta engineering, ports, and modern urban rebuilding.', image: imageCredits.erasmusBridge },
  { id: 'city-rotterdam', type: 'city', parentId: 'region-south-holland', countryCode: 'NL', name: 'Rotterdam', summary: 'A port city that turned rebuilding into an architectural identity.', image: imageCredits.erasmusBridge }
];

export const places = [
  {
    id: 'place-amsterdam-canal-ring', name: 'Amsterdam Canal Ring', country: 'Netherlands', countryCode: 'NL', region: 'North Holland', city: 'Amsterdam', destinationId: 'city-amsterdam',
    address: 'Grachtengordel, Amsterdam, Netherlands', latitude: 52.365, longitude: 4.887777777777777, category: 'Heritage', tags: ['canals', 'history', 'architecture'],
    description: 'The seventeenth-century canal ring inside the Singelgracht is a UNESCO World Heritage Site.',
    sources: [source('UNESCO World Heritage Centre', 'https://whc.unesco.org/en/list/1349/'), source('Wikidata location record', 'https://www.wikidata.org/wiki/Q340013')], lastVerified: verifiedOn, timeSensitive: false, image: imageCredits.canals
  },
  {
    id: 'place-rijksmuseum', name: 'Rijksmuseum', country: 'Netherlands', countryCode: 'NL', region: 'North Holland', city: 'Amsterdam', destinationId: 'city-amsterdam',
    address: 'Museumstraat 1, 1071 XX Amsterdam, Netherlands', latitude: 52.36, longitude: 4.885277777777778, category: 'Museum', tags: ['art', 'history', 'architecture'],
    description: 'The national museum brings Dutch art and history together in Pierre Cuypers\' 1885 building.',
    sources: [source('Rijksmuseum', 'https://www.rijksmuseum.nl/en/about-us/what-we-do/history'), source('Wikidata location record', 'https://www.wikidata.org/wiki/Q190804')], lastVerified: verifiedOn, timeSensitive: false, image: imageCredits.rijksmuseum
  },
  {
    id: 'place-anne-frank-house', name: 'Anne Frank House', country: 'Netherlands', countryCode: 'NL', region: 'North Holland', city: 'Amsterdam', destinationId: 'city-amsterdam',
    address: 'Westermarkt 20, 1016 DK Amsterdam, Netherlands', latitude: 52.3751472, longitude: 4.8840398, category: 'Memorial museum', tags: ['history', 'memory', 'Second World War'],
    description: 'The preserved hiding place connects one family\'s experience to the history of persecution during the Second World War.',
    sources: [source('Anne Frank House', 'https://www.annefrank.org/en/anne-frank/go-in-depth/history-secret-annex/'), source('Wikidata location record', 'https://www.wikidata.org/wiki/Q165366')], lastVerified: verifiedOn, timeSensitive: false, image: imageCredits.anneFrankHouse
  },
  {
    id: 'place-nemo', name: 'NEMO Science Museum', country: 'Netherlands', countryCode: 'NL', region: 'North Holland', city: 'Amsterdam', destinationId: 'city-amsterdam',
    address: 'Oosterdok 2, 1011 VX Amsterdam, Netherlands', latitude: 52.374106, longitude: 4.912392, category: 'Science museum', tags: ['science', 'design', 'architecture'],
    description: 'Renzo Piano designed the copper-green science museum above the IJ tunnel with a public roof square.',
    sources: [source('NEMO Science Museum', 'https://www.nemosciencemuseum.nl/en/organisation/building'), source('Wikidata location record', 'https://www.wikidata.org/wiki/Q1422000')], lastVerified: verifiedOn, timeSensitive: false, image: imageCredits.nemo
  },
  {
    id: 'place-dom-tower', name: 'Dom Tower', country: 'Netherlands', countryCode: 'NL', region: 'Utrecht', city: 'Utrecht', destinationId: 'city-utrecht',
    address: 'Domplein 9, 3512 JC Utrecht, Netherlands', latitude: 52.09065, longitude: 5.1214, category: 'Historic tower', tags: ['history', 'architecture', 'city view'],
    description: 'The 112-metre church tower has watched over Utrecht for roughly seven centuries.',
    sources: [source('Dom Tower Utrecht', 'https://www.domtoren.nl/en/the-story/'), source('Wikidata location record', 'https://www.wikidata.org/wiki/Q3368242')], lastVerified: verifiedOn, timeSensitive: false, image: imageCredits.domTower
  },
  {
    id: 'place-rietveld-house', name: 'Rietveld Schroder House', country: 'Netherlands', countryCode: 'NL', region: 'Utrecht', city: 'Utrecht', destinationId: 'city-utrecht',
    address: 'Prins Hendriklaan 50, 3583 EP Utrecht, Netherlands', latitude: 52.085333, longitude: 5.147597, category: 'Architecture', tags: ['De Stijl', 'design', 'UNESCO'],
    description: 'Gerrit Rietveld and Truus Schroder created a flexible 1924 home that became an icon of De Stijl.',
    sources: [source('Rietveld Schroder House', 'https://www.rietveldschroderhuis.nl/en/about'), source('Wikidata location record', 'https://www.wikidata.org/wiki/Q914231')], lastVerified: verifiedOn, timeSensitive: false, image: imageCredits.rietveld
  },
  {
    id: 'place-oudegracht', name: 'Oudegracht Wharves', country: 'Netherlands', countryCode: 'NL', region: 'Utrecht', city: 'Utrecht', destinationId: 'city-utrecht',
    address: 'Oudegracht, Utrecht, Netherlands', latitude: 52.09167, longitude: 5.11778, category: 'Historic canal', tags: ['canals', 'trade', 'heritage'],
    description: 'Lower wharves and cellars turned the canal into a two-level medieval port through the city.',
    sources: [source('Municipality of Utrecht Heritage', 'https://erfgoed.utrecht.nl/verhalen/de-utrechtse-werven'), source('Wikidata location record', 'https://www.wikidata.org/wiki/Q3191462')], lastVerified: verifiedOn, timeSensitive: false, image: imageCredits.oudegracht
  },
  {
    id: 'place-railway-museum', name: 'Railway Museum', country: 'Netherlands', countryCode: 'NL', region: 'Utrecht', city: 'Utrecht', destinationId: 'city-utrecht',
    address: 'Maliebaanstation 16, 3581 XW Utrecht, Netherlands', latitude: 52.08777777777778, longitude: 5.131666666666667, category: 'Museum', tags: ['railway', 'industry', 'history'],
    description: 'The national railway museum uses the restored Maliebaan Station, built in 1874, as its entrance.',
    sources: [source('Spoorwegmuseum', 'https://www.spoorwegmuseum.nl/en/ontdek/nu-in-het-museum/maliebaan-station/'), source('Wikidata location record', 'https://www.wikidata.org/wiki/Q847166')], lastVerified: verifiedOn, timeSensitive: false, image: imageCredits.railwayMuseum
  },
  {
    id: 'place-markthal', name: 'Markthal', country: 'Netherlands', countryCode: 'NL', region: 'South Holland', city: 'Rotterdam', destinationId: 'city-rotterdam',
    address: 'Ds. Jan Scharpstraat 298, 3011 GZ Rotterdam, Netherlands', latitude: 51.92011, longitude: 4.48695, category: 'Market and architecture', tags: ['food', 'architecture', 'public space'],
    description: 'An indoor food market sits beneath a large inhabited arch in central Rotterdam.',
    sources: [source('Markthal Rotterdam', 'https://markthal.nl/bezoek-markthal/'), source('Wikidata location record', 'https://www.wikidata.org/wiki/Q3327230')], lastVerified: verifiedOn, timeSensitive: false, image: imageCredits.markthal
  },
  {
    id: 'place-cube-houses', name: 'Cube Houses', country: 'Netherlands', countryCode: 'NL', region: 'South Holland', city: 'Rotterdam', destinationId: 'city-rotterdam',
    address: 'Overblaak 70, 3011 MH Rotterdam, Netherlands', latitude: 51.920208, longitude: 4.490482, category: 'Architecture', tags: ['structuralism', 'housing', 'design'],
    description: 'Piet Blom tilted homes above columns to form a dense urban forest near Blaak.',
    sources: [source('Kijk-Kubus Museum-house', 'https://www.kubuswoning.nl/en/'), source('Wikidata location record', 'https://www.wikidata.org/wiki/Q42153772')], lastVerified: verifiedOn, timeSensitive: false, image: imageCredits.cubeHouses
  },
  {
    id: 'place-depot-boijmans', name: 'Depot Boijmans Van Beuningen', country: 'Netherlands', countryCode: 'NL', region: 'South Holland', city: 'Rotterdam', destinationId: 'city-rotterdam',
    address: 'Museumpark 24, 3015 CX Rotterdam, Netherlands', latitude: 51.91379, longitude: 4.47125, category: 'Museum storage', tags: ['art', 'architecture', 'collections'],
    description: 'The mirrored MVRDV building makes art storage and conservation work visible to visitors.',
    sources: [source('Museum Boijmans Van Beuningen', 'https://www.boijmans.nl/en/depot/about-depot'), source('Wikidata location record', 'https://www.wikidata.org/wiki/Q41061028')], lastVerified: verifiedOn, timeSensitive: false, image: imageCredits.depot
  },
  {
    id: 'place-erasmus-bridge', name: 'Erasmus Bridge', country: 'Netherlands', countryCode: 'NL', region: 'South Holland', city: 'Rotterdam', destinationId: 'city-rotterdam',
    address: 'Erasmusbrug, Rotterdam, Netherlands', latitude: 51.90864, longitude: 4.48654, category: 'Bridge', tags: ['architecture', 'river', 'urban development'],
    description: 'The 1996 bridge connected the city centre with the redevelopment of Kop van Zuid.',
    sources: [source('Rotterdam City Archives', 'https://stadsarchief.rotterdam.nl/erasmusbrug'), source('Wikidata location record', 'https://www.wikidata.org/wiki/Q1348188')], lastVerified: verifiedOn, timeSensitive: false, image: imageCredits.erasmusBridge
  }
];

const card = (id, destinationId, category, title, hook, body, action, sourceName, sourceUrl, placeId) => ({
  id: `travel-${id}`, type: 'travel', destinationId, category, title, hook, body, action,
  tags: [category.toLowerCase(), destinationId.replace(/^(country|region|city)-/, '')],
  sources: [source(sourceName, sourceUrl)], lastVerified: verifiedOn, timeSensitive: false, ...(placeId ? { placeId } : {})
});

export const travelCards = [
  card('nl-water-is-infrastructure', 'country-nl', 'Useful', 'Water is infrastructure here', 'The landscape is not just scenery. It is an operating system.', 'Dutch cities depend on dunes, dikes, barriers, pumps, rivers, and constant maintenance working together. When you notice water levels and engineered edges, you are reading the country more clearly.', 'On your next walk, find one structure that controls, stores, or redirects water.', 'Rijkswaterstaat', 'https://www.rijkswaterstaat.nl/en/water/water-management'),
  card('nl-cycle-lanes-are-traffic', 'country-nl', 'Etiquette', 'A cycle lane is a traffic lane', 'Do not treat the red path like spare pavement.', 'The Netherlands designs cycling as transport, which means cycle tracks carry fast, directional traffic. Look both ways before crossing and avoid stopping in the lane.', 'Before crossing a cycle path, pause and scan in both directions.', 'Government of the Netherlands', 'https://www.government.nl/topics/bicycles'),
  card('nl-dutch-phrase', 'country-nl', 'Language', 'One phrase opens the door', 'Dank je wel is small, useful, and easy to remember.', 'English is common in the pilot cities, but using a simple Dutch thank-you shows attention. Pronunciation matters less than making the effort respectfully.', 'Use dank je wel once today after someone helps you.', 'Dutch Language Union', 'https://taalunie.org/information-about-the-dutch-language'),
  card('north-holland-water-city', 'region-north-holland', 'Misconceptions', 'Amsterdam is built with water, not beside it', 'The canals are only the visible layer.', 'Amsterdam began in marshland along the Amstel. Piles, locks, quays, pumps, and dikes all help the city occupy ground that demanded engineering.', 'Notice where a bridge, quay, or lock changes how the street works.', 'Municipality of Amsterdam', 'https://www.amsterdam.nl/stad-ontwikkeling/the-city-model-amsterdam/amsterdam%27-water-world/'),
  card('utrecht-region-crossroads', 'region-utrecht', 'Culture', 'Utrecht grew as a meeting point', 'Central is not the same as ordinary.', 'The region combines a compact historic city with routes extending toward river landscapes and modern design landmarks. Its position makes layers of movement easy to see.', 'Compare one medieval route with a modern rail or cycle route.', 'Visit Utrecht Region', 'https://www.visitutrechtregion.com/en/discover-utrecht-region/utrecht'),
  card('south-holland-port', 'region-south-holland', 'History', 'The sea route changed Rotterdam', 'A port can be reshaped by one piece of infrastructure.', 'In the nineteenth century, the port risked silting up. The Nieuwe Waterweg created a direct route through the dunes toward the North Sea and supported further port growth.', 'When you see the river, imagine the route continuing all the way to the sea.', 'Rotterdam City Archives', 'https://stadsarchief.rotterdam.nl/en/rotterdam-en'),

  card('amsterdam-canal-plan', 'city-amsterdam', 'History', 'The canal ring was planned expansion', 'The famous curves were city growth technology.', 'The seventeenth-century canal district combined waterways, plots, streets, homes, and trade into a large urban plan. Its value is the system, not one postcard bridge.', 'Follow one canal long enough to notice how streets and plots repeat.', 'UNESCO World Heritage Centre', 'https://whc.unesco.org/en/list/1349/', 'place-amsterdam-canal-ring'),
  card('amsterdam-rijksmuseum-building', 'city-amsterdam', 'Architecture', 'The museum building makes an argument', 'Gothic and Renaissance references were used to tell a national story.', 'Pierre Cuypers designed the Rijksmuseum as more than a container for art. Its architecture, decoration, and collection were arranged to express Dutch art and history when it opened in 1885.', 'Before entering, read the facade like the first object in the collection.', 'Rijksmuseum', 'https://www.rijksmuseum.nl/en/about-us/what-we-do/history', 'place-rijksmuseum'),
  card('amsterdam-secret-annex-space', 'city-amsterdam', 'History', 'The annex existed before it became a hiding place', 'Ordinary urban architecture became part of an extraordinary history.', 'Prinsengracht 263 had a rear annex because canal plots were narrow and deep. During the occupation, that hidden arrangement became the place where eight people lived in hiding.', 'Approach the site quietly and focus on the people, not a photo checklist.', 'Anne Frank House', 'https://www.annefrank.org/en/anne-frank/go-in-depth/history-secret-annex/', 'place-anne-frank-house'),
  card('amsterdam-nemo-tunnel', 'city-amsterdam', 'Architecture', 'NEMO rises because the road goes down', 'The building shape answers the tunnel underneath it.', 'Renzo Piano used the curve of the IJ tunnel as the foundation idea: traffic descends while the copper-green building appears to rise from the water, ending in a roof square.', 'Walk around the building and look for the tunnel-to-roof relationship.', 'NEMO Science Museum', 'https://www.nemosciencemuseum.nl/en/organisation/building', 'place-nemo'),
  card('amsterdam-name-from-dam', 'city-amsterdam', 'History', 'The name starts with a dam', 'Amsterdam carries its first piece of infrastructure in its name.', 'The settlement developed around a dam in the Amstel. That simple intervention in water became a durable clue to the city\'s origin.', 'At Dam Square, picture the river logic beneath the crowded centre.', 'Amsterdam City Archives', 'https://www.amsterdam.nl/stadsarchief/canon/windows/'),
  card('amsterdam-look-past-centre', 'city-amsterdam', 'Misconceptions', 'The postcard centre is not the whole city', 'A famous core can hide how a city actually lives.', 'The canal ring explains historic growth, but Amsterdam also extends across the IJ and into neighbourhoods shaped by housing, industry, migration, and newer public space.', 'Use one ferry, bridge, or tram route to look beyond the canal postcard.', 'Municipality of Amsterdam', 'https://www.amsterdam.nl/en/'),

  card('utrecht-dom-marker', 'city-utrecht', 'Places', 'The tower is the city compass', 'Utrecht keeps a 112-metre orientation point in the middle of town.', 'The Dom Tower has stood through roughly seven centuries of urban change. Dom Square beneath it moved from fortress to religious centre to civic meeting place.', 'Use the tower to orient yourself, then look down for older layers around the square.', 'Dom Tower Utrecht', 'https://www.domtoren.nl/en/the-story/', 'place-dom-tower'),
  card('utrecht-rietveld-flexible', 'city-utrecht', 'Architecture', 'This house refuses fixed rooms', 'Sliding walls turned one floor into different homes over a day.', 'Gerrit Rietveld and Truus Schroder designed the 1924 house together around light, movement, primary colours, and flexible space. It became an architectural highlight of De Stijl.', 'Look for one line or panel that makes inside and outside feel connected.', 'Rietveld Schroder House', 'https://www.rietveldschroderhuis.nl/en/explore/biography-of-the-house', 'place-rietveld-house'),
  card('utrecht-wharf-levels', 'city-utrecht', 'History', 'The canal works on two street levels', 'Merchants solved a lifting problem with tunnels and cellars.', 'From the late twelfth century, passages connected the lower wharf directly to storage below canal houses. The result was a long harbour running through the city.', 'Stand at street level, then descend and compare how the same building meets the canal.', 'Municipality of Utrecht Heritage', 'https://erfgoed.utrecht.nl/verhalen/de-utrechtse-werven', 'place-oudegracht'),
  card('utrecht-railway-station', 'city-utrecht', 'History', 'The museum entrance was once a working station', 'Maliebaan Station still carries the logic of nineteenth-century rail travel.', 'The station opened in 1874 on the Eastern Railway Line. Its restored waiting rooms and platform now frame the national railway collection.', 'Notice how separate waiting rooms reveal the social structure of old rail travel.', 'Spoorwegmuseum', 'https://www.spoorwegmuseum.nl/en/ontdek/nu-in-het-museum/maliebaan-station/', 'place-railway-museum'),
  card('utrecht-square-layers', 'city-utrecht', 'Useful', 'Dom Square is a stack of cities', 'The open space is easier to understand when you imagine what disappeared.', 'The square began around a Roman fortress, became a religious centre, and later a public meeting place. Its current openness hides earlier structures and uses.', 'Pause before crossing and identify one clue from a different historical layer.', 'Dom Tower Utrecht', 'https://www.domtoren.nl/en/the-story/'),
  card('utrecht-wharves-not-decoration', 'city-utrecht', 'Misconceptions', 'The wharves were logistics, not decoration', 'Cafe terraces arrived long after cargo handling.', 'For centuries, ships delivered goods at the lower level while tunnels and cellars moved storage beneath the houses. The attractive edge began as working infrastructure.', 'Look for cellar doors and loading geometry before looking for a terrace.', 'Municipality of Utrecht Heritage', 'https://erfgoed.utrecht.nl/verhalen/werk-aan-de-werf'),

  card('rotterdam-rebuilt-centre', 'city-rotterdam', 'History', 'The modern centre follows destruction', 'Rotterdam did not simply choose to look different.', 'German bombing on 14 May 1940 devastated much of the city centre. Reconstruction created space for new planning and architecture that still distinguishes Rotterdam.', 'Compare one surviving older fragment with the post-war street around it.', 'Rotterdam City Archives', 'https://stadsarchief.rotterdam.nl/en/rotterdam-en'),
  card('rotterdam-markthal-mix', 'city-rotterdam', 'Food', 'The market sits inside an inhabited arch', 'Food, housing, parking, and public space share one structure.', 'Markthal combines an indoor market floor with homes wrapped around it. The building turns an everyday food function into a large piece of central-city architecture.', 'Look up before choosing food and read how the arch frames the market.', 'Markthal Rotterdam', 'https://markthal.nl/bezoek-markthal/', 'place-markthal'),
  card('rotterdam-cube-forest', 'city-rotterdam', 'Architecture', 'Each cube is a tree in an urban forest', 'Piet Blom used a tilted house as part of a larger social idea.', 'The Cube Houses lift private homes above a public route. Blom\'s structuralist approach aimed to connect small spaces into a village-like whole.', 'Walk beneath the houses first, then inspect how private rooms sit above public movement.', 'Kijk-Kubus Museum-house', 'https://kubuswoning.nl/en/piet-blom.html', 'place-cube-houses'),
  card('rotterdam-depot-visible', 'city-rotterdam', 'Culture', 'The storage became the museum experience', 'Most collections hide their logistics. This building exposes them.', 'Depot Boijmans Van Beuningen was designed by MVRDV as a publicly accessible art storage facility. Conservation, storage, and collection care become visible parts of the visit.', 'Study the mirrored exterior as part of the collection experience, not just a selfie surface.', 'Museum Boijmans Van Beuningen', 'https://www.boijmans.nl/en/depot/about-depot', 'place-depot-boijmans'),
  card('rotterdam-bridge-development', 'city-rotterdam', 'Architecture', 'The bridge was also an urban strategy', 'A new crossing helped connect a new city district.', 'The Erasmus Bridge opened in 1996 as a key connection between the centre and Kop van Zuid, where former port land was being redeveloped.', 'Cross far enough to look back and compare both riverbanks.', 'Rotterdam City Archives', 'https://stadsarchief.rotterdam.nl/erasmusbrug', 'place-erasmus-bridge'),
  card('rotterdam-port-is-city', 'city-rotterdam', 'Misconceptions', 'The port is not a separate backdrop', 'Water access shaped the city\'s scale, work, and rebuilding choices.', 'Rotterdam expanded toward the Maas and repeatedly adapted its waterways and port areas. The river is part of the city\'s operating history, not only a view.', 'Trace one road, rail line, or bridge that serves movement around the river.', 'Rotterdam City Archives', 'https://stadsarchief.rotterdam.nl/en/rotterdam-en')
];

export function getDestination(id) {
  return destinations.find((destination) => destination.id === id) || null;
}

export function getDestinationAncestors(id) {
  const result = [];
  let current = getDestination(id);
  while (current) {
    result.push(current);
    current = current.parentId ? getDestination(current.parentId) : null;
  }
  return result;
}

export function getCities() {
  return destinations.filter((destination) => destination.type === 'city');
}

export function getTravelCards(destinationId, category = 'Mixed') {
  const ancestry = new Set(getDestinationAncestors(destinationId).map((destination) => destination.id));
  return travelCards.filter((item) => ancestry.has(item.destinationId) && (category === 'Mixed' || item.category === category));
}

export function getPlacesForDestination(destinationId) {
  const destination = getDestination(destinationId);
  if (!destination) return [];
  if (destination.type === 'city') return places.filter((place) => place.destinationId === destinationId);
  const descendants = new Set(destinations.filter((item) => item.type === 'city' && getDestinationAncestors(item.id).some((ancestor) => ancestor.id === destinationId)).map((item) => item.id));
  return places.filter((place) => descendants.has(place.destinationId));
}

export function getPlace(id) {
  return places.find((place) => place.id === id) || null;
}

export function travelAssetUrl(path, baseUrl = import.meta.env.BASE_URL) {
  return `${baseUrl}${path}`;
}

export function validateTravelData() {
  const errors = [];
  const allIds = [...destinations, ...places, ...travelCards].map((item) => item.id);
  if (new Set(allIds).size !== allIds.length) errors.push('Travel IDs must be globally unique.');
  for (const destination of destinations) {
    if (destination.parentId && !getDestination(destination.parentId)) errors.push(`Missing parent for ${destination.id}.`);
  }
  for (const item of [...places, ...travelCards]) {
    if (!getDestination(item.destinationId)) errors.push(`Missing destination for ${item.id}.`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.lastVerified)) errors.push(`Invalid verification date for ${item.id}.`);
    if (!Array.isArray(item.sources) || !item.sources.length || item.sources.some((entry) => !entry.name || !entry.url.startsWith('https://'))) errors.push(`Invalid sources for ${item.id}.`);
  }
  for (const place of places) {
    if (!place.image?.src || !place.image.alt || !place.image.credit || !place.image.license || !place.image.sourceUrl) errors.push(`Incomplete image attribution for ${place.id}.`);
    if ((Number.isFinite(place.latitude) && !Number.isFinite(place.longitude)) || (!Number.isFinite(place.latitude) && Number.isFinite(place.longitude))) errors.push(`Incomplete coordinates for ${place.id}.`);
  }
  for (const item of travelCards) {
    if (item.placeId && !getPlace(item.placeId)) errors.push(`Missing place for ${item.id}.`);
    if (!travelCategories.includes(item.category)) errors.push(`Unknown category for ${item.id}.`);
  }
  return errors;
}
