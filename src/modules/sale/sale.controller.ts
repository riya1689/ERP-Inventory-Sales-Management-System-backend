import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Sale } from './sale.model';
import { Product } from '../product/product.model';
import { AppError } from '../../utils/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { Customer } from '../customer/customer.model';

export const createSale = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    const { items, discount = 0, paymentMethod, customerName, customerPhone } = req.body;
    
    if (!items || items.length === 0) {
      throw new AppError('No products selected for sale', 400);
    }
    if (!customerName || !customerPhone) {
      throw new AppError('Customer Name and Phone Number are required', 400);
    }

    let subTotal = 0;
    let totalItemsPurchased = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      
      if (!product) {
        throw new AppError(`Product with ID ${item.productId} not found`, 404);
      }

      if (product.stockQuantity < item.quantity) {
        throw new AppError(`Not enough stock for ${product.name}. Only ${product.stockQuantity} left.`, 400);
      }

      const itemTotal = product.sellingPrice * item.quantity;
      subTotal += itemTotal;

      processedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.sellingPrice,
        total: itemTotal,
      });

      product.stockQuantity -= item.quantity;
      product.totalSold = (product.totalSold || 0) + item.quantity;
      totalItemsPurchased += item.quantity;
      await product.save({ session });
    }

    let customer = await Customer.findOne({ phoneNumber: customerPhone }).session(session);
    if (customer) {
      customer.totalPurchases += totalItemsPurchased;
      await customer.save({ session });
    } else {
      customer = new Customer({
        name: customerName,
        phoneNumber: customerPhone,
        totalPurchases: totalItemsPurchased,
      });
      await customer.save({ session });
    }

    const grandTotal = subTotal - discount;

    const invoiceNumber = `INV-${Math.floor(Math.random() * 10000000)}`;

    const newSale = await Sale.create([{
      invoiceNumber,
      items: processedItems,
      subTotal,
      discount,
      grandTotal,
      paymentMethod,
      soldBy: (req as any).user.id,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      status: 'success',
      data: {
        sale: newSale[0],
      },
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('sale_created', newSale[0]);
      io.emit('stock_updated');
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const getSalesHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const baseQuery = Sale.find()
      .populate('items.product', 'name sku productImage')
      .populate('soldBy', 'name email');

    const queryBuilder = new QueryBuilder(baseQuery, req.query)
      .search(['invoiceNumber'])
      .filter()
      .sort()
      .paginate();

    const sales = await queryBuilder.modelQuery;
    const total = await Sale.countDocuments(queryBuilder.modelQuery.getFilter());

    res.status(200).json({
      status: 'success',
      results: sales.length,
      data: {
        sales,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};