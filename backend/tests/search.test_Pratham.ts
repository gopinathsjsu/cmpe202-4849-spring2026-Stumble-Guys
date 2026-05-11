import request from 'supertest';

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
    $queryRawUnsafe: jest.fn(),
  };
  (globalThis as unknown as { __testPrismaMock?: typeof mock }).__testPrismaMock = mock;
  return {
    PrismaClient: jest.fn(() => mock),
  };
});

delete (globalThis as unknown as { prisma?: unknown }).prisma;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require('../src/app').default;

const prismaMock = (globalThis as unknown as { __testPrismaMock: Record<string, unknown> }).__testPrismaMock;

describe('Search & location discovery API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/search', () => {
    it('performs full-text search when q=music', async () => {
      (prismaMock.$queryRawUnsafe as jest.Mock)
        .mockResolvedValueOnce([{ total: 1 }])
        .mockResolvedValueOnce([
          {
            id: 'e1',
            title: 'Music Night',
            description: 'Live music',
            slug: 'music-night',
            status: 'approved',
            organizer: { id: 'u1', first_name: 'A', last_name: 'B', avatar_url: null },
            category: null,
          },
        ]);

      const res = await request(app).get('/api/v1/search').query({ q: 'music' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toMatchObject({
        page: 1,
        total: 1,
      });
    });
  });

  describe('GET /api/v1/events/nearby', () => {
    it('returns nearby events for latitude, longitude, and radius', async () => {
      const rows = [{ id: 'e1', title: 'Nearby Show', distance_km: 2.5 }];
      (prismaMock.$queryRawUnsafe as jest.Mock).mockResolvedValue(rows);

      const res = await request(app)
        .get('/api/v1/events/nearby')
        .query({ latitude: '37.3382', longitude: '-121.8863', radius: '25' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({
        data: rows,
        pagination: expect.objectContaining({ page: 1, limit: 10 }),
      });
    });
  });

  describe('GET /api/v1/events/map', () => {
    it('returns events within map bounds', async () => {
      (prismaMock.event as { findMany: jest.Mock }).findMany.mockResolvedValue([
        {
          id: 'e1',
          title: 'Map Pin Event',
          latitude: 37.3,
          longitude: -121.9,
          status: 'approved',
          organizer: { id: 'u1', first_name: 'A', last_name: 'B', avatar_url: null },
          category: null,
        },
      ]);

      const res = await request(app).get('/api/v1/events/map').query({
        north: '38',
        south: '37',
        east: '-121',
        west: '-122',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0]).toMatchObject({ title: 'Map Pin Event' });
    });
  });

  describe('GET /api/v1/events/trending', () => {
    it('returns trending events', async () => {
      (prismaMock.$queryRawUnsafe as jest.Mock).mockResolvedValue([
        {
          id: 'e1',
          title: 'Trending Con',
          view_count: 42,
          organizer: { id: 'u1', first_name: 'A', last_name: 'B', avatar_url: null },
          category: null,
        },
      ]);

      const res = await request(app).get('/api/v1/events/trending');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0]).toMatchObject({ title: 'Trending Con' });
    });
  });
});
