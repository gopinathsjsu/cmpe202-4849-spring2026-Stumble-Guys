import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface BayAreaVenue {
  venue_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number;
  longitude: number;
}

export const BAY_AREA_VENUES: BayAreaVenue[] = [
  {
    venue_name: 'San Jose Convention Center',
    address: '150 W San Carlos St',
    city: 'San Jose',
    state: 'CA',
    zip_code: '95113',
    latitude: 37.3296,
    longitude: -121.888,
  },
  {
    venue_name: 'SAP Center at San Jose',
    address: '525 W Santa Clara St',
    city: 'San Jose',
    state: 'CA',
    zip_code: '95113',
    latitude: 37.3327,
    longitude: -121.9012,
  },
  {
    venue_name: 'San Jose Museum of Art',
    address: '110 S Market St',
    city: 'San Jose',
    state: 'CA',
    zip_code: '95113',
    latitude: 37.3337,
    longitude: -121.8907,
  },
  {
    venue_name: 'San Pedro Square Market',
    address: '87 N San Pedro St',
    city: 'San Jose',
    state: 'CA',
    zip_code: '95110',
    latitude: 37.3365,
    longitude: -121.8944,
  },
  {
    venue_name: 'Moscone Center',
    address: '747 Howard St',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94103',
    latitude: 37.7842,
    longitude: -122.4016,
  },
  {
    venue_name: 'The Fillmore',
    address: '1805 Geary Blvd',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94115',
    latitude: 37.784,
    longitude: -122.4331,
  },
  {
    venue_name: 'Golden Gate Park',
    address: '501 Stanyan St',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94117',
    latitude: 37.7694,
    longitude: -122.4862,
  },
  {
    venue_name: 'Fort Mason Center',
    address: '2 Marina Blvd',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94123',
    latitude: 37.8064,
    longitude: -122.4315,
  },
  {
    venue_name: 'Palo Alto Art Center',
    address: '1313 Newell Rd',
    city: 'Palo Alto',
    state: 'CA',
    zip_code: '94303',
    latitude: 37.4443,
    longitude: -122.1378,
  },
  {
    venue_name: 'Mitchell Park Community Center',
    address: '3700 Middlefield Rd',
    city: 'Palo Alto',
    state: 'CA',
    zip_code: '94303',
    latitude: 37.4129,
    longitude: -122.1036,
  },
  {
    venue_name: 'Computer History Museum',
    address: '1401 N Shoreline Blvd',
    city: 'Mountain View',
    state: 'CA',
    zip_code: '94043',
    latitude: 37.4143,
    longitude: -122.0777,
  },
  {
    venue_name: 'Shoreline Amphitheatre',
    address: '1 Amphitheatre Pkwy',
    city: 'Mountain View',
    state: 'CA',
    zip_code: '94043',
    latitude: 37.4267,
    longitude: -122.0806,
  },
  {
    venue_name: 'Santa Clara Convention Center',
    address: '5001 Great America Pkwy',
    city: 'Santa Clara',
    state: 'CA',
    zip_code: '95054',
    latitude: 37.4041,
    longitude: -121.9757,
  },
  {
    venue_name: "Levi's Stadium",
    address: '4900 Marie P DeBartolo Way',
    city: 'Santa Clara',
    state: 'CA',
    zip_code: '95054',
    latitude: 37.4033,
    longitude: -121.9695,
  },
  {
    venue_name: 'Apple Park Visitor Center',
    address: '10600 N Tantau Ave',
    city: 'Cupertino',
    state: 'CA',
    zip_code: '95014',
    latitude: 37.3327,
    longitude: -122.0053,
  },
  {
    venue_name: 'Quinlan Community Center',
    address: '10185 N Stelling Rd',
    city: 'Cupertino',
    state: 'CA',
    zip_code: '95014',
    latitude: 37.3281,
    longitude: -122.0457,
  },
  {
    venue_name: 'Sunnyvale Community Center',
    address: '550 E Remington Dr',
    city: 'Sunnyvale',
    state: 'CA',
    zip_code: '94087',
    latitude: 37.3517,
    longitude: -122.0119,
  },
  {
    venue_name: 'Murphy Park',
    address: '250 N Sunnyvale Ave',
    city: 'Sunnyvale',
    state: 'CA',
    zip_code: '94085',
    latitude: 37.3811,
    longitude: -122.0274,
  },
];

export function getVenue(index: number): BayAreaVenue {
  return BAY_AREA_VENUES[index % BAY_AREA_VENUES.length];
}

export function getRandomVenue(): BayAreaVenue {
  return BAY_AREA_VENUES[Math.floor(Math.random() * BAY_AREA_VENUES.length)];
}

export function getVenuesByCity(city: string): BayAreaVenue[] {
  return BAY_AREA_VENUES.filter(
    (v) => v.city.toLowerCase() === city.toLowerCase()
  );
}

export async function updateEventLocations() {
  console.log('📍 Updating event locations with precise Bay Area coordinates...');

  const events = await prisma.event.findMany({
    where: { is_online: false },
    select: { id: true, city: true, venue_name: true },
  });

  let updated = 0;

  for (const event of events) {
    const matchByVenue = BAY_AREA_VENUES.find(
      (v) => v.venue_name === event.venue_name
    );
    const matchByCity = event.city
      ? BAY_AREA_VENUES.find(
          (v) => v.city.toLowerCase() === event.city!.toLowerCase()
        )
      : null;

    const match = matchByVenue || matchByCity;

    if (match) {
      await prisma.event.update({
        where: { id: event.id },
        data: {
          latitude: match.latitude,
          longitude: match.longitude,
          address: match.address,
          city: match.city,
          state: match.state,
          zip_code: match.zip_code,
          venue_name: match.venue_name,
        },
      });
      updated++;
    }
  }

  console.log(`📍 Updated ${updated}/${events.length} events with geolocation data.\n`);
}

export default updateEventLocations;
