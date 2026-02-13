import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './middleware/cors_Pratham';
import { apiLimiter, authLimiter } from './middleware/rateLimiter_Pratham';
import { errorHandler } from './middleware/errorHandler_Pratham';

import authRoutes from './routes/authRoutes_Preetam';
import userRoutes from './routes/userRoutes_Preetam';
import eventRoutes from './routes/eventRoutes_Nikhil';
import categoryRoutes from './routes/categoryRoutes_Nikhil';
import adminRoutes from './routes/adminRoutes_Nikhil';
import ticketRoutes from './routes/ticketRoutes_Sasi';
import rsvpRoutes from './routes/rsvpRoutes_Sasi';
import notificationRoutes from './routes/notificationRoutes_Sasi';
import searchRoutes from './routes/searchRoutes_Pratham';
import locationRoutes from './routes/locationRoutes_Pratham';

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authLimiter, authRoutes);

app.use('/api/v1', apiLimiter);

app.use('/api/v1/users', userRoutes);
// Location routes (nearby, map, trending) must register before event `/:slug` routes
app.use('/api/v1/events', locationRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/events', ticketRoutes);
app.use('/api/v1/events', rsvpRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/search', searchRoutes);

app.use(errorHandler);

export default app;
