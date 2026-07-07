import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from './product.controller';
import { protect, authorize } from '../../middlewares/authMiddleware';
import { upload } from '../../middlewares/uploadMiddleware';

const router = express.Router();

router.get('/', protect, getAllProducts);
router.get('/:id', protect, getProductById);

router.post(
  '/',
  protect,
  authorize('Admin', 'Manager'),
  upload.single('image'),
  createProduct
);

router.patch(
  '/:id',
  protect,
  authorize('Admin', 'Manager'),
  upload.single('image'),
  updateProduct
);

router.delete(
  '/:id',
  protect,
  authorize('Admin', 'Manager'),
  deleteProduct
);

export default router;