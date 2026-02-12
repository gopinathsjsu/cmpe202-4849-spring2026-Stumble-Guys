import { Router } from 'express';
import * as categoryController from '../controllers/categoryController_Nikhil';

const router = Router();

router.get('/', categoryController.listCategories);

export default router;
