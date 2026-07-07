import { Request, Response, NextFunction } from 'express';
import { Product } from './product.model';
import { AppError } from '../../utils/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new AppError('Product image is required!', 400));
    }

    const productData = {
      ...req.body,
      productImage: req.file.path, 
    };

    const product = await Product.create(productData);

    res.status(201).json({
      status: 'success',
      data: {
        product,
      },
    });

    const io = req.app.get('io');
    if (io) io.emit('product_updated');
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryBuilder = new QueryBuilder(Product.find(), req.query)
      .search(['name', 'sku', 'category'])
      .filter()
      .sort()
      .paginate();

    const products = await queryBuilder.modelQuery;
    
    const total = await Product.countDocuments(queryBuilder.modelQuery.getFilter());

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.productImage = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });

    const io = req.app.get('io');
    if (io) io.emit('product_updated');
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });

    const io = req.app.get('io');
    if (io) io.emit('product_updated');
  } catch (error) {
    next(error);
  }
};