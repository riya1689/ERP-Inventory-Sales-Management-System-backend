import express from 'express';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from './category.controller';
import { protect, authorize } from '../../middlewares/authMiddleware';

const router = express.Router();

router.get('/', protect, getAllCategories);

// Only admin can manage categories
router.use(protect, authorize('Admin'));

router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
