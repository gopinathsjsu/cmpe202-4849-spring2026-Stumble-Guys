import { Router } from 'express';
import { authenticate } from '../middleware/auth_Preetam';
import { validate } from '../middleware/validate_Pratham';
import { nearbyQuerySchema, mapBoundsSchema } from '../validators/searchSchemas_Pratham';
import * as locationController from '../controllers/locationController_Pratham';
import * as searchController from '../controllers/searchController_Pratham';
import * as notificationController from '../controllers/notificationController_Sasi';

const router = Router();

router.get('/nearby', validate(nearbyQuerySchema, 'query'), locationController.getNearby);
router.get('/map', validate(mapBoundsSchema, 'query'), locationController.getMapEvents);
router.get('/trending', searchController.getTrending);
router.get('/saved', authenticate, locationController.getSavedEvents);
router.post('/:id/save', authenticate, locationController.saveEvent);
router.delete('/:id/save', authenticate, locationController.unsaveEvent);
router.get('/:id/stats', authenticate, locationController.getEventStats);
router.post('/:id/calendar', authenticate, notificationController.getCalendarFile);

export default router;
