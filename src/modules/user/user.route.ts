import express from 'express';
import { login, createUser } from './user.controller';
import { protect, authorize } from '../../middlewares/authMiddleware';

const router = express.Router();

router.post('/login', login);

router.post('/create', protect, authorize('Admin'), createUser);

export default router;