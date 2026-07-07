import express from 'express';
import { createSale, getSalesHistory } from './sale.controller';
import { protect } from '../../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/', createSale);
router.get('/', getSalesHistory);

export default router;