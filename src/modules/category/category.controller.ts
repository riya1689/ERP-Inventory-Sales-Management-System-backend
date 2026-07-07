import { Request, Response, NextFunction } from 'express';
import { Category } from './category.model';
import { Product } from '../product/product.model';
import { AppError } from '../../utils/AppError';

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find().sort('name');
    res.status(200).json({
      status: 'success',
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    if (!name) {
      return next(new AppError('Category name is required', 400));
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return next(new AppError('Category already exists', 400));
    }

    const category = await Category.create({ name });
    res.status(201).json({
      status: 'success',
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
      return next(new AppError('Category name is required', 400));
    }

    const category = await Category.findById(id);
    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    const oldName = category.name;
    
    // Update category
    category.name = name;
    await category.save();

    // Update all products that had this category name
    await Product.updateMany({ category: oldName }, { category: name });

    res.status(200).json({
      status: 'success',
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
