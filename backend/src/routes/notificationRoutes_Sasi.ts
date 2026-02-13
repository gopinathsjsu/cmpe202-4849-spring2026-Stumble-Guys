import { Router } from 'express';
import { authenticate } from '../middleware/auth_Preetam';

const router = Router();

router.get('/', authenticate, (_req, res) => {
  res.status(501).json({ message: 'Notifications endpoint not implemented yet' });
});

export default router;

