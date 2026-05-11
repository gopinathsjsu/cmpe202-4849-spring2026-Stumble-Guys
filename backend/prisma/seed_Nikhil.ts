import { Prisma, PrismaClient } from '@prisma/client';
import { seedUsers } from './seed-users_Preetam';
import { seedTickets } from './seed-tickets_Sasi';
import { updateEventLocations, getVenue } from './seed-locations_Pratham';

const prisma = new PrismaClient();

interface CategorySeed {
  name: string;
  slug: string;
  icon: string;
}

interface EventSeed {
  organizer_id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  short_desc: string;
  start_date: Date;
  end_date: Date;
  venue_name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  is_online?: boolean;
  online_url?: string;
  is_free: boolean;
  price: number;
  capacity: number;
  status: string;
  tags: string[];
  image_url: string;
  schedule?: Prisma.InputJsonValue;
}

const categories: CategorySeed[] = [
  { name: 'Music', slug: 'music', icon: 'music' },
  { name: 'Technology', slug: 'technology', icon: 'cpu' },
  { name: 'Business', slug: 'business', icon: 'briefcase' },
  { name: 'Food & Drink', slug: 'food-and-drink', icon: 'utensils' },
  { name: 'Arts', slug: 'arts', icon: 'palette' },
  { name: 'Sports & Fitness', slug: 'sports-and-fitness', icon: 'dumbbell' },
  { name: 'Health', slug: 'health', icon: 'heart-pulse' },
  { name: 'Community', slug: 'community', icon: 'users' },
  { name: 'Education', slug: 'education', icon: 'graduation-cap' },
  { name: 'Charity', slug: 'charity', icon: 'hand-heart' },
];

async function seedCategories() {
  console.log('🌱 Seeding categories...');

  const created = [];
  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    created.push(category);
    console.log(`  ✅ Category: ${cat.name}`);
  }

  console.log(`🌱 Seeded ${created.length} categories.\n`);
  return created;
}

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function hoursLater(base: Date, hours: number): Date {
  return new Date(base.getTime() + hours * 60 * 60 * 1000);
}

async function seedEvents(
  organizerIds: string[],
  categoryMap: Record<string, string>
) {
  console.log('🌱 Seeding events...');

  const org1 = organizerIds[0];
  // For easier testing: seed all events under a single organizer (org1).
  // Keep org2 user seeded (seed-users) but don't attach events to it.
  const org2 = organizerIds[0];

  const eventData: EventSeed[] = [
    // --- MUSIC (4 events) ---
    {
      organizer_id: org1,
      category_id: categoryMap['music'],
      title: 'Bay Area Jazz Night',
      slug: 'bay-area-jazz-night-2026',
      description:
        'An evening of smooth jazz performances featuring local Bay Area artists. Enjoy world-class musicians in an intimate setting with craft cocktails and gourmet appetizers.',
      short_desc: 'Live jazz performances by local Bay Area artists.',
      start_date: daysFromNow(14),
      end_date: hoursLater(daysFromNow(14), 4),
      ...getVenue(5),
      is_free: false,
      price: 35.0,
      capacity: 500,
      status: 'approved',
      tags: ['jazz', 'live-music', 'nightlife'],
      image_url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629',
    },
    {
      organizer_id: org2,
      category_id: categoryMap['music'],
      title: 'Sunnyvale Summer Concert Series',
      slug: 'sunnyvale-summer-concert-2026',
      description:
        'Free outdoor concert series at Murphy Park featuring indie rock, folk, and pop acts every Saturday through the summer. Bring your blankets and picnic baskets!',
      short_desc: 'Free outdoor concerts every Saturday at Murphy Park.',
      start_date: daysFromNow(30),
      end_date: hoursLater(daysFromNow(30), 3),
      ...getVenue(17),
      is_free: true,
      price: 0,
      capacity: 2000,
      status: 'approved',
      tags: ['concert', 'outdoor', 'free', 'family-friendly'],
      image_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea',
    },
    {
      organizer_id: org1,
      category_id: categoryMap['music'],
      title: 'Electronic Music Festival',
      slug: 'electronic-music-festival-2026',
      description:
        'Two-day electronic music festival at Shoreline Amphitheatre featuring top DJs and producers from around the world. Multiple stages, food trucks, and art installations.',
      short_desc: 'Two-day EDM festival at Shoreline Amphitheatre.',
      start_date: daysFromNow(60),
      end_date: hoursLater(daysFromNow(61), 8),
      ...getVenue(11),
      is_free: false,
      price: 150.0,
      capacity: 15000,
      status: 'approved',
      tags: ['edm', 'festival', 'electronic', 'dj'],
      image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
    },
    {
      organizer_id: org2,
      category_id: categoryMap['music'],
      title: 'Acoustic Open Mic Night',
      slug: 'acoustic-open-mic-night-sj',
      description:
        'Monthly open mic night at San Pedro Square Market. Sign up to perform or just come to enjoy the talent. All acoustic instruments welcome.',
      short_desc: 'Monthly open mic night for acoustic performers.',
      start_date: daysAgo(10),
      end_date: hoursLater(daysAgo(10), 3),
      ...getVenue(3),
      is_free: true,
      price: 0,
      capacity: 100,
      status: 'completed',
      tags: ['open-mic', 'acoustic', 'local'],
      image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
    },

    // --- TECHNOLOGY (4 events) ---
    {
      organizer_id: org1,
      category_id: categoryMap['technology'],
      title: 'Silicon Valley AI & ML Summit 2026',
      slug: 'sv-ai-ml-summit-2026',
      description:
        'The premier AI and machine learning conference in Silicon Valley. Two days of keynotes, workshops, and networking with industry leaders from Google, Meta, Apple, and top startups.',
      short_desc: 'Premier AI/ML conference with industry leaders.',
      start_date: daysFromNow(45),
      end_date: hoursLater(daysFromNow(46), 8),
      ...getVenue(0),
      is_free: false,
      price: 299.0,
      capacity: 3000,
      status: 'approved',
      tags: ['ai', 'machine-learning', 'tech', 'conference'],
      image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
      schedule: [
        { time: '9:00 AM', title: 'Registration & Breakfast', speaker: '' },
        { time: '10:00 AM', title: 'Keynote: The Future of AGI', speaker: 'Dr. Sarah Chen' },
        { time: '11:30 AM', title: 'Panel: AI Ethics in Practice', speaker: 'Various' },
        { time: '1:00 PM', title: 'Lunch Break', speaker: '' },
        { time: '2:00 PM', title: 'Workshop: Building with LLMs', speaker: 'James Liu' },
        { time: '4:00 PM', title: 'Networking Reception', speaker: '' },
      ],
    },
    {
      organizer_id: org1,
      category_id: categoryMap['technology'],
      title: 'React & Next.js Developer Meetup',
      slug: 'react-nextjs-meetup-mv-2026',
      description:
        'Monthly developer meetup at the Computer History Museum. This month we cover React Server Components, Next.js App Router patterns, and building performant web apps.',
      short_desc: 'Monthly meetup for React and Next.js developers.',
      start_date: daysFromNow(7),
      end_date: hoursLater(daysFromNow(7), 3),
      ...getVenue(10),
      is_free: true,
      price: 0,
      capacity: 150,
      status: 'approved',
      tags: ['react', 'nextjs', 'javascript', 'meetup', 'web-dev'],
      image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    },
    {
      organizer_id: org2,
      category_id: categoryMap['technology'],
      title: 'Women in Tech Conference',
      slug: 'women-in-tech-conf-2026',
      description:
        'A full-day conference celebrating women in technology. Featuring keynotes from industry leaders, mentorship sessions, career workshops, and a hiring fair.',
      short_desc: 'Conference celebrating and empowering women in tech.',
      start_date: daysFromNow(21),
      end_date: hoursLater(daysFromNow(21), 9),
      ...getVenue(12),
      is_free: false,
      price: 75.0,
      capacity: 800,
      status: 'approved',
      tags: ['women-in-tech', 'diversity', 'conference', 'career'],
      image_url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6',
    },
    {
      organizer_id: org1,
      category_id: categoryMap['technology'],
      title: 'Startup Weekend San Jose',
      slug: 'startup-weekend-sj-2026',
      description:
        'A 54-hour weekend event where developers, designers, and business minds come together to pitch ideas, form teams, and launch startups. Prizes for top 3 teams.',
      short_desc: '54-hour startup building competition.',
      start_date: daysAgo(30),
      end_date: hoursLater(daysAgo(28), 8),
      ...getVenue(0),
      is_free: false,
      price: 50.0,
      capacity: 200,
      status: 'completed',
      tags: ['startup', 'hackathon', 'entrepreneurship'],
      image_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd',
    },

    // --- BUSINESS (3 events) ---
    {
      organizer_id: org2,
      category_id: categoryMap['business'],
      title: 'Bay Area Entrepreneurs Networking Mixer',
      slug: 'ba-entrepreneurs-mixer-2026',
      description:
        'Connect with fellow entrepreneurs, investors, and startup founders at this casual networking mixer. Complimentary drinks and appetizers included.',
      short_desc: 'Networking mixer for entrepreneurs and investors.',
      start_date: daysFromNow(10),
      end_date: hoursLater(daysFromNow(10), 3),
      ...getVenue(3),
      is_free: false,
      price: 25.0,
      capacity: 120,
      status: 'approved',
      tags: ['networking', 'entrepreneurs', 'startups', 'business'],
      image_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7',
    },
    {
      organizer_id: org1,
      category_id: categoryMap['business'],
      title: 'Venture Capital Pitch Night',
      slug: 'vc-pitch-night-pa-2026',
      description:
        'Ten pre-selected startups pitch to a panel of top-tier VC firms. Audience voting determines the People\'s Choice winner. Great opportunity to see the next big ideas.',
      short_desc: 'Startups pitch to top VCs for funding.',
      start_date: daysFromNow(18),
      end_date: hoursLater(daysFromNow(18), 4),
      ...getVenue(9),
      is_free: false,
      price: 40.0,
      capacity: 250,
      status: 'pending_approval',
      tags: ['vc', 'pitch', 'startups', 'investment'],
      image_url: 'https://images.unsplash.com/photo-1559523182-a284c3fb7cff',
    },
    {
      organizer_id: org2,
      category_id: categoryMap['business'],
      title: 'Digital Marketing Masterclass',
      slug: 'digital-marketing-masterclass-2026',
      description:
        'Full-day intensive workshop covering SEO, social media strategy, content marketing, paid advertising, and analytics. Hands-on exercises with real-world campaigns.',
      short_desc: 'Hands-on digital marketing workshop.',
      start_date: daysAgo(15),
      end_date: hoursLater(daysAgo(15), 8),
      ...getVenue(16),
      is_free: false,
      price: 120.0,
      capacity: 60,
      status: 'completed',
      tags: ['marketing', 'digital', 'workshop', 'seo'],
      image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    },

    // --- FOOD & DRINK (3 events) ---
    {
      organizer_id: org2,
      category_id: categoryMap['food-and-drink'],
      title: 'San Jose Food Truck Festival',
      slug: 'sj-food-truck-festival-2026',
      description:
        'Over 40 food trucks gather at San Pedro Square for a weekend celebration of street food. Live music, craft beer garden, and a dessert alley you won\'t want to miss.',
      short_desc: '40+ food trucks, live music, and craft beer.',
      start_date: daysFromNow(25),
      end_date: hoursLater(daysFromNow(26), 6),
      ...getVenue(3),
      is_free: true,
      price: 0,
      capacity: 5000,
      status: 'approved',
      tags: ['food', 'food-truck', 'festival', 'street-food'],
      image_url: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb',
    },
    {
      organizer_id: org1,
      category_id: categoryMap['food-and-drink'],
      title: 'Wine Tasting: California Pinot Noirs',
      slug: 'california-pinot-noir-tasting-2026',
      description:
        'Explore 15 exceptional Pinot Noirs from California\'s top wine regions. Expert sommeliers guide you through tasting notes and food pairing recommendations.',
      short_desc: 'Guided tasting of 15 California Pinot Noirs.',
      start_date: daysFromNow(12),
      end_date: hoursLater(daysFromNow(12), 3),
      ...getVenue(7),
      is_free: false,
      price: 65.0,
      capacity: 40,
      status: 'approved',
      tags: ['wine', 'tasting', 'pinot-noir', 'california'],
      image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3',
    },
    {
      organizer_id: org2,
      category_id: categoryMap['food-and-drink'],
      title: 'Sushi Making Workshop',
      slug: 'sushi-making-workshop-2026',
      description:
        'Learn the art of sushi making from Chef Tanaka. You\'ll master nigiri, maki rolls, and temaki. All ingredients and tools provided. Take home your creations!',
      short_desc: 'Hands-on sushi making class with Chef Tanaka.',
      start_date: daysAgo(5),
      end_date: hoursLater(daysAgo(5), 3),
      ...getVenue(15),
      is_free: false,
      price: 85.0,
      capacity: 20,
      status: 'completed',
      tags: ['sushi', 'cooking', 'workshop', 'japanese'],
      image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    },

    // --- ARTS (3 events) ---
    {
      organizer_id: org2,
      category_id: categoryMap['arts'],
      title: 'South Bay Art Walk & Gallery Night',
      slug: 'south-bay-art-walk-2026',
      description:
        'Self-guided art walk through downtown San Jose galleries and studios. Over 30 artists showcase their work with live demonstrations, interactive installations, and pop-up shops.',
      short_desc: 'Art walk through 30+ galleries in downtown San Jose.',
      start_date: daysFromNow(8),
      end_date: hoursLater(daysFromNow(8), 5),
      ...getVenue(2),
      is_free: true,
      price: 0,
      capacity: 1000,
      status: 'approved',
      tags: ['art', 'gallery', 'art-walk', 'downtown'],
      image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
    },
    {
      organizer_id: org1,
      category_id: categoryMap['arts'],
      title: 'Watercolor Painting Workshop',
      slug: 'watercolor-workshop-pa-2026',
      description:
        'Beginner-friendly watercolor painting workshop at the Palo Alto Art Center. All materials provided. Learn techniques for landscapes, florals, and abstract art.',
      short_desc: 'Beginner watercolor workshop at Palo Alto Art Center.',
      start_date: daysFromNow(16),
      end_date: hoursLater(daysFromNow(16), 4),
      ...getVenue(8),
      is_free: false,
      price: 45.0,
      capacity: 30,
      status: 'approved',
      tags: ['watercolor', 'painting', 'workshop', 'beginner'],
      image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
    },
    {
      organizer_id: org2,
      category_id: categoryMap['arts'],
      title: 'Photography Exhibition: Urban Landscapes',
      slug: 'photography-urban-landscapes-2026',
      description:
        'A curated exhibition of urban landscape photography by 12 Bay Area photographers. Opening reception with artist talks and refreshments.',
      short_desc: 'Urban photography exhibition by Bay Area artists.',
      start_date: daysAgo(20),
      end_date: hoursLater(daysAgo(20), 4),
      ...getVenue(2),
      is_free: true,
      price: 0,
      capacity: 200,
      status: 'completed',
      tags: ['photography', 'exhibition', 'urban', 'art'],
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    },

    // --- SPORTS & FITNESS (3 events) ---
    {
      organizer_id: org1,
      category_id: categoryMap['sports-and-fitness'],
      title: 'San Jose 10K Run for Charity',
      slug: 'sj-10k-charity-run-2026',
      description:
        'Annual 10K charity run through downtown San Jose. All proceeds go to local youth sports programs. Finishers receive a medal and event t-shirt.',
      short_desc: '10K charity run through downtown San Jose.',
      start_date: daysFromNow(35),
      end_date: hoursLater(daysFromNow(35), 4),
      ...getVenue(0),
      is_free: false,
      price: 45.0,
      capacity: 2000,
      status: 'approved',
      tags: ['running', '10k', 'charity', 'fitness'],
      image_url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3',
    },
    {
      organizer_id: org2,
      category_id: categoryMap['sports-and-fitness'],
      title: 'Outdoor Yoga in the Park',
      slug: 'outdoor-yoga-golden-gate-2026',
      description:
        'Free outdoor yoga session in Golden Gate Park led by certified instructors. All levels welcome. Bring your own mat and water.',
      short_desc: 'Free yoga session at Golden Gate Park.',
      start_date: daysFromNow(5),
      end_date: hoursLater(daysFromNow(5), 2),
      ...getVenue(6),
      is_free: true,
      price: 0,
      capacity: 200,
      status: 'approved',
      tags: ['yoga', 'outdoor', 'fitness', 'free', 'park'],
      image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
    },
    {
      organizer_id: org1,
      category_id: categoryMap['sports-and-fitness'],
      title: 'CrossFit Community Challenge',
      slug: 'crossfit-challenge-sc-2026',
      description:
        'Team-based CrossFit competition open to all fitness levels. Form a team of 4 and compete in modified WODs. Great atmosphere, food vendors, and prizes.',
      short_desc: 'Team CrossFit competition for all levels.',
      start_date: daysAgo(7),
      end_date: hoursLater(daysAgo(7), 6),
      ...getVenue(13),
      is_free: false,
      price: 30.0,
      capacity: 300,
      status: 'completed',
      tags: ['crossfit', 'competition', 'fitness', 'team'],
      image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
    },

    // --- HEALTH (3 events) ---
    {
      organizer_id: org2,
      category_id: categoryMap['health'],
      title: 'Mental Health Awareness Workshop',
      slug: 'mental-health-workshop-2026',
      description:
        'Interactive workshop covering stress management, mindfulness techniques, and building emotional resilience. Led by licensed therapists and wellness coaches.',
      short_desc: 'Workshop on stress management and mindfulness.',
      start_date: daysFromNow(20),
      end_date: hoursLater(daysFromNow(20), 4),
      ...getVenue(9),
      is_free: true,
      price: 0,
      capacity: 80,
      status: 'approved',
      tags: ['mental-health', 'wellness', 'mindfulness', 'workshop'],
      image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    },
    {
      organizer_id: org1,
      category_id: categoryMap['health'],
      title: 'Nutrition & Meal Prep Seminar',
      slug: 'nutrition-meal-prep-seminar-2026',
      description:
        'Learn how to plan and prep healthy meals for the week. Registered dietitian covers macros, portion control, budget-friendly shopping, and quick recipes.',
      short_desc: 'Healthy meal planning and prep seminar.',
      start_date: daysFromNow(28),
      end_date: hoursLater(daysFromNow(28), 3),
      ...getVenue(16),
      is_free: false,
      price: 20.0,
      capacity: 50,
      status: 'pending_approval',
      tags: ['nutrition', 'meal-prep', 'health', 'diet'],
      image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
    },
    {
      organizer_id: org2,
      category_id: categoryMap['health'],
      title: 'Guided Meditation Retreat',
      slug: 'meditation-retreat-cupertino-2026',
      description:
        'Half-day meditation retreat with guided sessions, breathwork, sound healing, and a vegetarian lunch. Perfect for beginners and experienced meditators alike.',
      short_desc: 'Half-day guided meditation retreat.',
      start_date: daysAgo(3),
      end_date: hoursLater(daysAgo(3), 5),
      ...getVenue(15),
      is_free: false,
      price: 55.0,
      capacity: 35,
      status: 'completed',
      tags: ['meditation', 'retreat', 'mindfulness', 'sound-healing'],
      image_url: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2',
    },

    // --- COMMUNITY (3 events) ---
    {
      organizer_id: org1,
      category_id: categoryMap['community'],
      title: 'Neighborhood Block Party',
      slug: 'neighborhood-block-party-sv-2026',
      description:
        'Annual neighborhood block party with live music, bounce houses, face painting, BBQ, and community booths. Meet your neighbors and celebrate our community!',
      short_desc: 'Annual block party with food, music, and fun.',
      start_date: daysFromNow(40),
      end_date: hoursLater(daysFromNow(40), 6),
      ...getVenue(17),
      is_free: true,
      price: 0,
      capacity: 500,
      status: 'approved',
      tags: ['community', 'block-party', 'family-friendly', 'outdoor'],
      image_url: 'https://images.unsplash.com/photo-1529543544282-ea75407407db',
    },
    {
      organizer_id: org2,
      category_id: categoryMap['community'],
      title: 'Volunteer Day: Park Cleanup',
      slug: 'park-cleanup-volunteer-day-2026',
      description:
        'Join us for a community park cleanup day. Gloves, bags, and tools provided. Lunch served for all volunteers. Make a difference in your community!',
      short_desc: 'Community park cleanup volunteer event.',
      start_date: daysFromNow(3),
      end_date: hoursLater(daysFromNow(3), 4),
      ...getVenue(6),
      is_free: true,
      price: 0,
      capacity: 150,
      status: 'approved',
      tags: ['volunteer', 'community', 'park', 'cleanup'],
      image_url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a',
    },
    {
      organizer_id: org1,
      category_id: categoryMap['community'],
      title: 'Cultural Heritage Festival',
      slug: 'cultural-heritage-festival-2026',
      description:
        'Celebrate the diverse cultural heritage of the Bay Area with traditional performances, ethnic food, craft vendors, and storytelling from 20+ cultural communities.',
      short_desc: 'Multicultural festival celebrating Bay Area diversity.',
      start_date: daysAgo(45),
      end_date: hoursLater(daysAgo(45), 8),
      ...getVenue(0),
      is_free: true,
      price: 0,
      capacity: 3000,
      status: 'completed',
      tags: ['culture', 'festival', 'diversity', 'heritage'],
      image_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    },

    // --- EDUCATION (3 events) ---
    {
      organizer_id: org1,
      category_id: categoryMap['education'],
      title: 'Python for Data Science Bootcamp',
      slug: 'python-data-science-bootcamp-2026',
      description:
        'Intensive 2-day bootcamp covering Python, pandas, NumPy, matplotlib, and intro to machine learning. Laptops required. Prior programming experience recommended.',
      short_desc: '2-day Python data science intensive bootcamp.',
      start_date: daysFromNow(22),
      end_date: hoursLater(daysFromNow(23), 8),
      ...getVenue(10),
      is_free: false,
      price: 199.0,
      capacity: 60,
      status: 'approved',
      tags: ['python', 'data-science', 'bootcamp', 'programming'],
      image_url: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935',
      schedule: [
        { time: '9:00 AM', title: 'Setup & Python Refresher', speaker: '' },
        { time: '10:30 AM', title: 'Data Manipulation with Pandas', speaker: 'Dr. Priya Sharma' },
        { time: '1:00 PM', title: 'Lunch Break', speaker: '' },
        { time: '2:00 PM', title: 'Data Visualization', speaker: 'Dr. Priya Sharma' },
        { time: '4:00 PM', title: 'Hands-on Project', speaker: '' },
      ],
    },
    {
      organizer_id: org2,
      category_id: categoryMap['education'],
      title: 'Public Speaking Masterclass',
      slug: 'public-speaking-masterclass-2026',
      description:
        'Overcome your fear of public speaking! Full-day workshop with professional speech coach covering body language, storytelling, and presentation design.',
      short_desc: 'Public speaking workshop with professional coach.',
      start_date: daysFromNow(15),
      end_date: hoursLater(daysFromNow(15), 7),
      ...getVenue(9),
      is_free: false,
      price: 89.0,
      capacity: 40,
      status: 'approved',
      tags: ['public-speaking', 'workshop', 'communication', 'career'],
      image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2',
    },
    {
      organizer_id: org1,
      category_id: categoryMap['education'],
      title: 'College Prep & SAT Strategy Workshop',
      slug: 'college-prep-sat-workshop-2026',
      description:
        'Free workshop for high school juniors and seniors. Covers SAT/ACT strategies, college application essays, financial aid, and scholarship opportunities.',
      short_desc: 'Free college prep workshop for high schoolers.',
      start_date: daysFromNow(50),
      end_date: hoursLater(daysFromNow(50), 5),
      ...getVenue(9),
      is_free: true,
      price: 0,
      capacity: 100,
      status: 'draft',
      tags: ['college', 'sat', 'education', 'high-school', 'free'],
      image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c476',
    },

    // --- CHARITY (3 events) ---
    {
      organizer_id: org2,
      category_id: categoryMap['charity'],
      title: 'Gala Dinner: Homes for All',
      slug: 'homes-for-all-gala-2026',
      description:
        'Annual charity gala dinner supporting affordable housing initiatives in the Bay Area. Silent auction, live entertainment, keynote by local housing advocates.',
      short_desc: 'Charity gala supporting affordable housing.',
      start_date: daysFromNow(55),
      end_date: hoursLater(daysFromNow(55), 5),
      ...getVenue(4),
      is_free: false,
      price: 200.0,
      capacity: 400,
      status: 'approved',
      tags: ['charity', 'gala', 'housing', 'fundraiser'],
      image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    },
    {
      organizer_id: org1,
      category_id: categoryMap['charity'],
      title: 'Charity Dog Walk & Adoption Fair',
      slug: 'charity-dog-walk-adoption-2026',
      description:
        'Walk your pup and help raise funds for local animal shelters! 3-mile scenic route with water stations, dog treats, vendor booths, and an adoption fair.',
      short_desc: 'Dog walk fundraiser with adoption fair.',
      start_date: daysFromNow(9),
      end_date: hoursLater(daysFromNow(9), 4),
      ...getVenue(6),
      is_free: false,
      price: 15.0,
      capacity: 500,
      status: 'approved',
      tags: ['charity', 'dogs', 'adoption', 'walk', 'animals'],
      image_url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
    },
    {
      organizer_id: org2,
      category_id: categoryMap['charity'],
      title: 'Back-to-School Supply Drive',
      slug: 'back-to-school-supply-drive-2026',
      description:
        'Help provide school supplies for underprivileged students. Drop off supplies or donate online. Volunteer to help sort and distribute. Every contribution counts!',
      short_desc: 'School supply donation drive for local students.',
      start_date: daysAgo(60),
      end_date: hoursLater(daysAgo(60), 6),
      ...getVenue(16),
      is_free: true,
      price: 0,
      capacity: 200,
      status: 'completed',
      tags: ['charity', 'school', 'donation', 'community', 'volunteer'],
      image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
    },

    // --- ONLINE EVENTS (2 events) ---
    {
      organizer_id: org1,
      category_id: categoryMap['technology'],
      title: 'Remote Work Best Practices Webinar',
      slug: 'remote-work-webinar-2026',
      description:
        'Learn from leaders at fully remote companies about productivity tools, async communication, work-life balance, and building culture in distributed teams.',
      short_desc: 'Webinar on remote work productivity and culture.',
      start_date: daysFromNow(6),
      end_date: hoursLater(daysFromNow(6), 2),
      venue_name: 'Online - Zoom',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      latitude: 0,
      longitude: 0,
      is_online: true,
      online_url: 'https://zoom.us/j/example-remote-work',
      is_free: true,
      price: 0,
      capacity: 500,
      status: 'approved',
      tags: ['remote-work', 'webinar', 'productivity', 'online'],
      image_url: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b',
    },
    {
      organizer_id: org2,
      category_id: categoryMap['education'],
      title: 'Creative Writing Online Workshop',
      slug: 'creative-writing-online-2026',
      description:
        'Six-week online creative writing workshop covering short fiction, poetry, and personal essays. Weekly live sessions with peer feedback and instructor review.',
      short_desc: 'Online creative writing workshop series.',
      start_date: daysFromNow(11),
      end_date: hoursLater(daysFromNow(11), 2),
      venue_name: 'Online - Google Meet',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      latitude: 0,
      longitude: 0,
      is_online: true,
      online_url: 'https://meet.google.com/example-writing',
      is_free: false,
      price: 149.0,
      capacity: 25,
      status: 'approved',
      tags: ['writing', 'creative', 'online', 'workshop'],
      image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a',
    },

    // --- ADDITIONAL DRAFT/PENDING (2 events) ---
    {
      organizer_id: org1,
      category_id: categoryMap['technology'],
      title: 'Blockchain & Web3 Developer Workshop',
      slug: 'blockchain-web3-workshop-2026',
      description:
        'Hands-on workshop for developers interested in blockchain technology, smart contracts with Solidity, and building decentralized applications on Ethereum.',
      short_desc: 'Hands-on blockchain and Web3 development workshop.',
      start_date: daysFromNow(70),
      end_date: hoursLater(daysFromNow(70), 8),
      ...getVenue(10),
      is_free: false,
      price: 175.0,
      capacity: 50,
      status: 'draft',
      tags: ['blockchain', 'web3', 'solidity', 'ethereum', 'workshop'],
      image_url: 'https://images.unsplash.com/photo-1639762681057-408e52192e55',
    },
    {
      organizer_id: org2,
      category_id: categoryMap['food-and-drink'],
      title: 'Craft Beer & Artisan Cheese Pairing',
      slug: 'craft-beer-cheese-pairing-2026',
      description:
        'Explore the perfect pairings of local craft beers and artisan cheeses from Bay Area producers. Guided by a certified cicerone and cheese expert.',
      short_desc: 'Craft beer and artisan cheese pairing event.',
      start_date: daysFromNow(33),
      end_date: hoursLater(daysFromNow(33), 3),
      ...getVenue(7),
      is_free: false,
      price: 70.0,
      capacity: 30,
      status: 'pending_approval',
      tags: ['beer', 'cheese', 'pairing', 'craft', 'artisan'],
      image_url: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13',
    },
  ];

  const createdEvents = [];

  for (const evt of eventData) {
    const event = await prisma.event.upsert({
      where: { slug: evt.slug },
      update: {},
      create: {
        organizer_id: evt.organizer_id,
        category_id: evt.category_id,
        title: evt.title,
        slug: evt.slug,
        description: evt.description,
        short_desc: evt.short_desc,
        start_date: evt.start_date,
        end_date: evt.end_date,
        venue_name: evt.venue_name,
        address: evt.address,
        city: evt.city,
        state: evt.state,
        zip_code: evt.zip_code,
        country: 'US',
        latitude: evt.latitude || null,
        longitude: evt.longitude || null,
        is_online: evt.is_online || false,
        online_url: evt.online_url || null,
        image_url: evt.image_url || null,
        capacity: evt.capacity,
        is_free: evt.is_free,
        price: evt.price,
        status: evt.status,
        tags: evt.tags,
        schedule: evt.schedule || undefined,
      },
    });
    createdEvents.push(event);
    console.log(`  ✅ Event: ${evt.title} [${evt.status}]`);
  }

  console.log(`🌱 Seeded ${createdEvents.length} events.\n`);
  return createdEvents;
}

/** Demo data so organizer RSVP queue is non-empty after seed (free events + pending approval). */
async function seedPendingRsvps(organizerId: string, attendeeUserIds: string[]) {
  console.log('🌱 Seeding pending RSVPs (Going → awaiting organizer approval)...');

  const targets = await prisma.event.findMany({
    where: { organizer_id: organizerId, is_free: true, status: 'approved' },
    select: { id: true, title: true },
    orderBy: { start_date: 'asc' },
    take: 12,
  });

  if (targets.length === 0 || attendeeUserIds.length === 0) {
    console.log('  ⏭️  Skip: no free approved events or no attendees.\n');
    return;
  }

  const pairs = Math.min(targets.length, attendeeUserIds.length, 6);
  for (let i = 0; i < pairs; i++) {
    const ev = targets[i];
    const uid = attendeeUserIds[i];
    await prisma.rsvp.upsert({
      where: {
        event_id_user_id: { event_id: ev.id, user_id: uid },
      },
      update: {
        status: 'going',
        approval_status: 'pending',
      },
      create: {
        event_id: ev.id,
        user_id: uid,
        status: 'going',
        approval_status: 'pending',
      },
    });
    console.log(`  ✅ Pending RSVP: ${ev.title}`);
  }
  console.log(`🌱 Seeded ${pairs} pending RSVP(s).\n`);
}

async function main() {
  console.log('🚀 Starting EventHub database seed...\n');

  try {
    const users = await seedUsers();

    const adminUser = users.find((u) => u.role === 'admin')!;
    const organizers = users.filter((u) => u.role === 'organizer');
    const organizerIds = organizers.map((o) => o.id);

    const categoryRecords = await seedCategories();
    const categoryMap: Record<string, string> = {};
    for (const cat of categoryRecords) {
      categoryMap[cat.slug] = cat.id;
    }

    const events = await seedEvents(organizerIds, categoryMap);

    await updateEventLocations();

    await seedTickets(events, users);

    const org1 = users.find((u) => u.email === 'org1@eventhub.com')!;
    const attendeeIds = users.filter((u) => u.role === 'attendee').map((u) => u.id);
    await seedPendingRsvps(org1.id, attendeeIds);

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
