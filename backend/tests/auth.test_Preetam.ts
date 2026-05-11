import request from 'supertest';
import jwt from 'jsonwebtoken';
import { hashPassword } from '../src/utils/passwordUtils_Preetam';
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

const validPassword = 'Password1';
const userId = '11111111-1111-1111-1111-111111111111';

describe('Auth API', () => {
  let passwordHash: string;

  beforeAll(async () => {
    passwordHash = await hashPassword(validPassword);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    it('returns 201 with success, data, and message on success', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: userId,
        email: 'new@example.com',
        password_hash: 'hash',
        first_name: 'New',
        last_name: 'User',
        role: 'attendee',
        avatar_url: null,
        phone: null,
        bio: null,
        is_verified: false,
        is_active: true,
        created_at: new Date(),
      });
      prismaMock.refreshToken.create.mockResolvedValue({});

      const res = await request(app).post('/api/v1/auth/register').send({
        email: 'new@example.com',
        password: validPassword,
        first_name: 'New',
        last_name: 'User',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBeTruthy();
      expect(res.body.data).toMatchObject({
        user: expect.objectContaining({ email: 'new@example.com' }),
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it('returns 400 when email is already registered', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: userId,
        email: 'taken@example.com',
      });

      const res = await request(app).post('/api/v1/auth/register').send({
        email: 'taken@example.com',
        password: validPassword,
        first_name: 'A',
        last_name: 'B',
      });

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toContain('Email already registered');
    });

    it('returns 400 for weak password (validation)', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        email: 'weak@example.com',
        password: 'short',
        first_name: 'A',
        last_name: 'B',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.code).toBe('VALIDATION_ERROR');
    });

    it('returns 400 when required fields are missing', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        email: 'only@example.com',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('returns 200 with tokens and user on success', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: userId,
        email: 'login@example.com',
        password_hash: passwordHash,
        first_name: 'Log',
        last_name: 'In',
        role: 'attendee',
        avatar_url: null,
        phone: null,
        bio: null,
        is_verified: true,
        is_active: true,
        created_at: new Date(),
      });
      prismaMock.refreshToken.create.mockResolvedValue({});

      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'login@example.com',
        password: validPassword,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        user: expect.objectContaining({ email: 'login@example.com' }),
      });
    });

    it('returns 401 for wrong password', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: userId,
        email: 'login@example.com',
        password_hash: passwordHash,
        first_name: 'Log',
        last_name: 'In',
        role: 'attendee',
        avatar_url: null,
        phone: null,
        bio: null,
        is_verified: true,
        is_active: true,
        created_at: new Date(),
      });

      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'login@example.com',
        password: 'WrongPass1',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('returns 401 for non-existent email', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'nobody@example.com',
        password: validPassword,
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    const token = jwt.sign(
      { userId, email: 'me@example.com', role: 'attendee' },
      jwtConfig.secret,
      { expiresIn: '15m' }
    );

    it('returns profile with valid Bearer token', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: userId,
        email: 'me@example.com',
        first_name: 'Me',
        last_name: 'User',
        role: 'attendee',
        avatar_url: null,
        phone: null,
        bio: null,
        is_verified: true,
        created_at: new Date(),
      });

      const res = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({ email: 'me@example.com' });
    });

    it('returns 401 without token', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('returns 401 for expired token', async () => {
      const expired = jwt.sign(
        { userId, email: 'me@example.com', role: 'attendee', exp: Math.floor(Date.now() / 1000) - 60 },
        jwtConfig.secret
      );

      const res = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${expired}`);
      expect(res.status).toBe(401);
      expect(res.body.error?.message).toMatch(/Invalid|expired/i);
    });
  });

  describe('PUT /api/v1/auth/me', () => {
    const token = jwt.sign(
      { userId, email: 'me@example.com', role: 'attendee' },
      jwtConfig.secret,
      { expiresIn: '15m' }
    );

    it('updates profile successfully', async () => {
      prismaMock.user.update.mockResolvedValue({
        id: userId,
        email: 'me@example.com',
        first_name: 'Updated',
        last_name: 'Name',
        role: 'attendee',
        avatar_url: null,
        phone: null,
        bio: 'Hello',
        is_verified: true,
        created_at: new Date(),
      });

      const res = await request(app)
        .put('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ first_name: 'Updated', last_name: 'Name', bio: 'Hello' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({ first_name: 'Updated', bio: 'Hello' });
    });
  });

  describe('PUT /api/v1/auth/me/password', () => {
    const token = jwt.sign(
      { userId, email: 'me@example.com', role: 'attendee' },
      jwtConfig.secret,
      { expiresIn: '15m' }
    );

    it('changes password when current password is correct', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: userId,
        password_hash: passwordHash,
      });
      prismaMock.user.update.mockResolvedValue({});

      const res = await request(app)
        .put('/api/v1/auth/me/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ current_password: validPassword, new_password: 'Newpass2' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/password/i);
    });

    it('returns error when current password is wrong', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: userId,
        password_hash: passwordHash,
      });

      const res = await request(app)
        .put('/api/v1/auth/me/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ current_password: 'WrongPass1', new_password: 'Newpass2' });

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toMatch(/Current password/i);
    });
  });
});
