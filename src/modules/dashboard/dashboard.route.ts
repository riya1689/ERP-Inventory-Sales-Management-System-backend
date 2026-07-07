import express from 'express';
import { getDashboardStats } from './dashboard.controller';
import { protect } from '../../middlewares/authMiddleware';

const router = express.Router();

router.get('/', protect, getDashboardStats);

export default router;