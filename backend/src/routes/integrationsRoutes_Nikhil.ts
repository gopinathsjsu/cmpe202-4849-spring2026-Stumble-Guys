import { Router } from 'express';
import { authenticate } from '../middleware/auth_Preetam';
import * as integrationsController from '../controllers/integrationsController_Nikhil';

const router = Router();

router.get('/google-calendar/callback', integrationsController.googleCalendarOAuthCallback);

router.get(
  '/google-calendar/connect',
  authenticate,
  integrationsController.googleCalendarConnectUrl
);
router.post(
  '/google-calendar/disconnect',
  authenticate,
  integrationsController.googleCalendarDisconnect
);
router.get('/google-calendar/status', authenticate, integrationsController.googleCalendarStatus);
router.post(
  '/google-calendar/events/:eventId',
  authenticate,
  integrationsController.googleCalendarPushEvent
);

export default router;
