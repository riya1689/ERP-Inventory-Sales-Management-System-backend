import express from 'express';
import { getCustomers } from './customer.controller';
import { protect } from '../../middlewares/authMiddleware';

const router = express.Router();

router.use(protect); 


router.get('/', getCustomers);

export default router;
