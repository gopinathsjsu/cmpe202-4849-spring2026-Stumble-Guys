import { Router } from 'express';
import { validate } from '../middleware/validate_Pratham';
import { searchQuerySchema } from '../validators/searchSchemas_Pratham';
import * as searchController from '../controllers/searchController_Pratham';

const router = Router();

router.get('/', validate(searchQuerySchema, 'query'), searchController.search);

export default router;
