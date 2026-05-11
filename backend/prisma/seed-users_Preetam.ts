import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface SeedUser {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  bio?: string;
  phone?: string;
  is_verified: boolean;
}

const users: SeedUser[] = [
  {
    email: 'admin@eventhub.com',
    password: 'Admin@123',
    first_name: 'Admin',
    last_name: 'User',
    role: 'admin',
    bio: 'Platform administrator for EventHub.',
    phone: '408-555-0100',
    is_verified: true,
  },
  {
    email: 'org1@eventhub.com',
    password: 'Organizer@123',
    first_name: 'John',
    last_name: 'Smith',
    role: 'organizer',
    bio: 'Event organizer specializing in tech conferences and meetups in the Bay Area.',
    phone: '408-555-0201',
    is_verified: true,
  },
  {
    email: 'org2@eventhub.com',
    password: 'Organizer@123',
    first_name: 'Jane',
    last_name: 'Doe',
    role: 'organizer',
    bio: 'Community builder and event organizer focused on arts, food, and cultural events.',
    phone: '650-555-0202',
    is_verified: true,
  },
  {
    email: 'user1@eventhub.com',
    password: 'User@1234',
    first_name: 'Alice',
    last_name: 'Johnson',
    role: 'attendee',
    bio: 'Tech enthusiast who loves attending hackathons and developer meetups.',
    phone: '408-555-0301',
    is_verified: true,
  },
  {
    email: 'user2@eventhub.com',
    password: 'User@1234',
    first_name: 'Bob',
    last_name: 'Williams',
    role: 'attendee',
    bio: 'Music lover and foodie always looking for the next great event.',
    phone: '650-555-0302',
    is_verified: true,
  },
  {
    email: 'user3@eventhub.com',
    password: 'User@1234',
    first_name: 'Carlos',
    last_name: 'Garcia',
    role: 'attendee',
    bio: 'Fitness enthusiast and community volunteer.',
    phone: '510-555-0303',
    is_verified: false,
  },
  {
    email: 'user4@eventhub.com',
    password: 'User@1234',
    first_name: 'Diana',
    last_name: 'Chen',
    role: 'attendee',
    bio: 'Artist and designer who enjoys creative workshops and gallery openings.',
    phone: '408-555-0304',
    is_verified: true,
  },
  {
    email: 'user5@eventhub.com',
    password: 'User@1234',
    first_name: 'Ethan',
    last_name: 'Patel',
    role: 'attendee',
    bio: 'Startup founder interested in business networking and entrepreneurship events.',
    phone: '650-555-0305',
    is_verified: false,
  },
];

export async function seedUsers() {
  console.log('🌱 Seeding users...');

  const createdUsers = [];

  for (const userData of users) {
    const password_hash = await bcrypt.hash(userData.password, 12);

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        password_hash,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        bio: userData.bio,
        phone: userData.phone,
        is_verified: userData.is_verified,
        is_active: true,
      },
    });

    createdUsers.push(user);
    console.log(`  ✅ Created ${userData.role}: ${userData.email}`);
  }

  console.log(`🌱 Seeded ${createdUsers.length} users successfully.\n`);
  return createdUsers;
}

export default seedUsers;
