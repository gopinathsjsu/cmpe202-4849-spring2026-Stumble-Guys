import cors from 'cors';

const origin = process.env.CORS_ORIGIN || 'http://localhost:5173';

export const corsMiddleware = cors({
  origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
});
