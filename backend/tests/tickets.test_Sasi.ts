import request from 'supertest';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../src/config/jwt_Preetam';

jest.mock('@prisma/client', () => {
  const mock: Record<string, unknown> = {
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
    ticketType: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    ticket: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
  };
  mock.$transaction = jest.fn(async (cb: (tx: typeof mock) => Promise<unknown>) => cb(mock as typeof mock));
  (globalThis as unknown as { __testPrismaMock?: typeof mock }).__testPrismaMock = mock;
  return {
    PrismaClient: jest.fn(() => mock),
  };
});

delete (globalThis as unknown as { prisma?: unknown }).prisma;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require('../src/app').default;

const prismaMock = (globalThis as unknown as { __testPrismaMock: Record<string, unknown> }).__testPrismaMock;

const organizerId = '22222222-2222-2222-2222-222222222222';
const buyerId = '55555555-5555-5555-5555-555555555555';
const eventId = '44444444-4444-4444-4444-444444444444';
const ticketTypeId = '66666666-6666-6666-6666-666666666666';
const ticketId = '77777777-7777-7777-7777-777777777777';

function organizerToken() {
  return jwt.sign(
    { userId: organizerId, email: 'org@example.com', role: 'organizer' },
    jwtConfig.secret,
    { expiresIn: '15m' }
  );
}

function buyerToken() {
  return jwt.sign(
    { userId: buyerId, email: 'buyer@example.com', role: 'attendee' },
    jwtConfig.secret,
    { expiresIn: '15m' }
  );
}

describe('Ticket API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/events/:id/ticket-types', () => {
    it('creates a ticket type for the event owner', async () => {
      (prismaMock.event as { findUnique: jest.Mock }).findUnique.mockResolvedValue({
        id: eventId,
        organizer_id: organizerId,
      });
      (prismaMock.ticketType as { create: jest.Mock }).create.mockResolvedValue({
        id: ticketTypeId,
        event_id: eventId,
        name: 'General',
        price: 25,
        quantity: 100,
        sold_count: 0,
      });

      const res = await request(app)
        .post(`/api/v1/events/${eventId}/ticket-types`)
        .set('Authorization', `Bearer ${organizerToken()}`)
        .send({ name: 'General', price: 25, quantity: 100 });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({ name: 'General', quantity: 100 });
    });
  });

  describe('POST /api/v1/events/:id/tickets/purchase', () => {
    it('purchases tickets successfully', async () => {
      (prismaMock.ticketType as { findUnique: jest.Mock }).findUnique.mockResolvedValue({
        id: ticketTypeId,
        event_id: eventId,
        price: 10,
        quantity: 50,
        sold_count: 5,
      });
      (prismaMock.ticket as { create: jest.Mock }).create.mockResolvedValue({
        id: ticketId,
        ticket_number: 'T-001',
        user_id: buyerId,
        event_id: eventId,
        ticket_type_id: ticketTypeId,
        status: 'confirmed',
        event: { id: eventId, title: 'Show', start_date: new Date(), venue_name: 'Hall' },
        ticket_type: { id: ticketTypeId, name: 'GA', price: 10 },
      });
      (prismaMock.notification as { create: jest.Mock }).create.mockResolvedValue({});

      const res = await request(app)
        .post(`/api/v1/events/${eventId}/tickets/purchase`)
        .set('Authorization', `Bearer ${buyerToken()}`)
        .send({ ticket_type_id: ticketTypeId, quantity: 1 });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0]).toMatchObject({ ticket_type_id: ticketTypeId });
    });

    it('returns error when tickets are sold out', async () => {
      (prismaMock.ticketType as { findUnique: jest.Mock }).findUnique.mockResolvedValue({
        id: ticketTypeId,
        event_id: eventId,
        price: 10,
        quantity: 10,
        sold_count: 10,
      });

      const res = await request(app)
        .post(`/api/v1/events/${eventId}/tickets/purchase`)
        .set('Authorization', `Bearer ${buyerToken()}`)
        .send({ ticket_type_id: ticketTypeId, quantity: 1 });

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toMatch(/remaining/i);
    });
  });

  describe('GET /api/v1/events/tickets/my', () => {
    it('lists tickets for the authenticated user', async () => {
      (prismaMock.ticket as { findMany: jest.Mock; count: jest.Mock }).findMany.mockResolvedValue([
        {
          id: ticketId,
          ticket_number: 'T-001',
          event: { id: eventId, title: 'Show', start_date: new Date(), venue_name: 'Hall', image_url: null },
          ticket_type: { id: ticketTypeId, name: 'GA', price: 10 },
        },
      ]);
      (prismaMock.ticket as { findMany: jest.Mock; count: jest.Mock }).count.mockResolvedValue(1);

      const res = await request(app).get('/api/v1/events/tickets/my').set('Authorization', `Bearer ${buyerToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toMatchObject({ total: 1 });
    });
  });

  describe('PUT /api/v1/events/tickets/:id/cancel', () => {
    it('cancels the user ticket', async () => {
      (prismaMock.ticket as { findUnique: jest.Mock }).findUnique
        .mockResolvedValueOnce({
          id: ticketId,
          user_id: buyerId,
          ticket_type_id: ticketTypeId,
          status: 'confirmed',
        })
        .mockResolvedValueOnce({
          id: ticketId,
          user_id: buyerId,
          ticket_type_id: ticketTypeId,
          status: 'confirmed',
        });

      (prismaMock.ticket as { update: jest.Mock }).update.mockResolvedValue({
        id: ticketId,
        status: 'cancelled',
      });
      (prismaMock.ticketType as { update: jest.Mock }).update.mockResolvedValue({});

      const res = await request(app)
        .put(`/api/v1/events/tickets/${ticketId}/cancel`)
        .set('Authorization', `Bearer ${buyerToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
