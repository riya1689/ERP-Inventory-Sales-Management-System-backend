import { Request, Response, NextFunction } from 'express';
import { Product } from '../product/product.model';
import { Sale } from '../sale/sale.model';
import { Category } from '../category/category.model';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalProducts = await Product.countDocuments();

    const totalSales = await Sale.countDocuments();

    const totalCategories = await Category.countDocuments();

    const revenueAggregation = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$grandTotal' }
        }
      }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 7);

    const dailyRevenue = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: eightDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$grandTotal" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const chartData = dailyRevenue.map((data) => ({
      name: data._id.substring(5),
      revenue: data.revenue
    }));

    const lowStockProducts = await Product.find({ stockQuantity: { $lt: 5 } })
      .select('name sku stockQuantity productImage')
      .limit(5);

    const recentSales = await Sale.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('soldBy', 'name');

    res.status(200).json({
      status: 'success',
      data: {
        totalProducts,
        totalSales,
        totalCategories,
        totalRevenue,
        chartData,
        lowStockProducts,
        recentSales,
      },
    });
  } catch (error) {
    next(error);
  }
};