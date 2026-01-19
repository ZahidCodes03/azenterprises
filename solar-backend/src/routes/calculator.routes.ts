import { Router } from 'express';
import * as calculatorController from '../controllers/calculator.controller';
import { validate } from '../middleware/validation.middleware';
import { calculatorSchema } from '../utils/validation.schemas';

const router = Router();

router.post('/estimate', validate(calculatorSchema), calculatorController.calculateEstimate);

export default router;
