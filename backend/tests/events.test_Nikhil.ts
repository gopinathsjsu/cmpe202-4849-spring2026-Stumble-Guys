import request from 'supertest';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../src/config/jwt_Preetam';

jest.mock('@prisma/client', () => {
  const mock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    refreshToken: {
      findFirst: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    event: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  (globalThis as unknown as { __testPrismaMock?: typeof mock }).__testPrismaMock = mock;
  return {
    PrismaClient: jest.fn(() => mock),
  };
});

delete (globalThis as unknown as { prisma?: unknown }).prisma;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require('../src/app').default;

const prismaMock = (globalThis as unknown as { __testPrismaMock: Record<string, Record<string, jest.Mock>> })
  .__testPrismaMock;

const organizerId = '22222222-2222-2222-2222-222222222222';
const attendeeId = '33333333-3333-3333-3333-333333333333';
const eventId = '44444444-4444-4444-4444-444444444444';

const baseEvent = {
  id: eventId,
  title: 'Test Event',
  slug: 'test-event',
  description: 'A long enough description for validation rules.',
  short_desc: null,
  category_id: null,
  organizer_id: organizerId,
  start_date: new Date('2026-06-01T18:00:00Z'),
  end_date: new Date('2026-06-01T21:00:00Z'),
  timezone: 'UTC',
  venue_name: 'Hall',
  address: null,
  city: 'SF',
  state: null,
  zip_code: null,
  country: null,
  latitude: null,
  longitude: null,
  is_online: false,
  online_url: null,
  image_url: null,
  capacity: 100,
  is_free: true,
  price: null,
  tags: [],
  schedule: [],
  status: 'draft',
  created_at: new Date(),
  updated_at: new Date(),
};

function organizerToken() {
  return jwt.sign(
    { userId: organizerId, email: 'org@example.com', role: 'organizer' },
    jwtConfig.secret,
    { expiresIn: '15m' }
  );
}

function attendeeToken() {
  return jwt.sign(
    { userId: attendeeId, email: 'att@example.com', role: 'attendee' },
    jwtConfig.secret,
    { expiresIn: '15m' }
  );
}

describe('Event API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/events', () => {
    const validBody = {
      title: 'Summer Music Fest',
      description: 'A long enough description for validation rules.',
      start_date: '2026-07-01T18:00:00.000Z',
      end_date: '2026-07-01T22:00:00.000Z',
      city: 'San Jose',
    };

    it('creates an event as organizer (201)', async () => {
      prismaMock.event.create.mockResolvedValue({
        ...baseEvent,
        title: 'Summer Music Fest',
        slug: 'summer-music-fest',
        status: 'pending_approval',
        organizer: { id: organizerId, first_name: 'O', last_name: 'G', avatar_url: null },
        category: null,
      });

      const res = await request(app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${organizerToken()}`)
        .send(validBody);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({
        title: 'Summer Music Fest',
        status: 'pending_approval',
      });
    });

    it('returns 403 for attendee role', async () => {
      const res = await request(app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${attendeeToken()}`)
        .send(validBody);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/events', () => {
    it('lists approved events with pagination metadata', async () => {
      prismaMock.event.findMany.mockResolvedValue([{ ...baseEvent, status: 'approved' }]);
      prismaMock.event.count.mockResolvedValue(1);

      const res = await request(app).get('/api/v1/events').query({ page: '1', limit: '10' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
    });

    it('applies search and category filters', async () => {
      prismaMock.event.findMany.mockResolvedValue([]);
      prismaMock.event.count.mockResolvedValue(0);

      const res = await request(app).get('/api/v1/events').query({
        search: 'music',
        category: 'cat-uuid-here',
        page: '2',
        limit: '5',
      });

      expect(res.status).toBe(200);
      expect(prismaMock.event.findMany).toHaveBeenCalled();
    });
  });

  describe('GET /api/v1/events/:slug', () => {
    it('returns event by slug', async () => {
      prismaMock.event.findUnique.mockResolvedValue({
        ...baseEvent,
        status: 'approved',
        organizer: { id: organizerId, first_name: 'O', last_name: 'G', avatar_url: null },
        category: { id: 'c1', name: 'Music', slug: 'music' },
        ticket_types: [],
      });

      const res = await request(app).get('/api/v1/events/test-event');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe('test-event');
    });

    it('returns 404 when slug does not exist', async () => {
      prismaMock.event.findUnique.mockResolvedValue(null);

      const res = await request(app).get('/api/v1/events/missing-slug');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/events/:id', () => {
    it('updates event when requester is the owner', async () => {
      prismaMock.event.findUnique.mockResolvedValue({ ...baseEvent, organizer_id: organizerId });
      prismaMock.event.update.mockResolvedValue({
        ...baseEvent,
        title: 'Updated Title',
        organizer: { id: organizerId, first_name: 'O', last_name: 'G', avatar_url: null },
        category: null,
      });

      const res = await request(app)
        .put(`/api/v1/events/${eventId}`)
        .set('Authorization', `Bearer ${organizerToken()}`)
        .send({ title: 'Updated Title' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Title');
    });
  });

  describe('DELETE /api/v1/events/:id', () => {
    it('soft-deletes (cancels) event for owner', async () => {
      prismaMock.event.findUnique.mockResolvedValue({ ...baseEvent, organizer_id: organizerId });
      prismaMock.event.update.mockResolvedValue({ ...baseEvent, status: 'cancelled' });

      const res = await request(app)
        .delete(`/api/v1/events/${eventId}`)
        .set('Authorization', `Bearer ${organizerToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/events/:id/submit', () => {
    it('submits draft event for approval', async () => {
      prismaMock.event.findUnique.mockResolvedValue({ ...baseEvent, organizer_id: organizerId, status: 'draft' });
      prismaMock.event.update.mockResolvedValue({ ...baseEvent, status: 'pending_approval' });

      const res = await request(app)
        .post(`/api/v1/events/${eventId}/submit`)
        .set('Authorization', `Bearer ${organizerToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('pending_approval');
    });
  });
});
