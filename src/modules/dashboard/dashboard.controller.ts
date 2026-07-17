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

    const startDate = new Date('2026-07-01T00:00:00.000Z');

    const monthlyRevenue = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$grandTotal" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const revenueMap = new Map();
    monthlyRevenue.forEach((item) => {
      revenueMap.set(item._id, item.revenue);
    });

    const chartData = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    let iterYear = 2026;
    let iterMonth = 6; // July is index 6

    while (iterYear < currentYear || (iterYear === currentYear && iterMonth <= currentMonth)) {
      const iterDate = new Date(iterYear, iterMonth, 1);
      const monthStr = `${iterYear}-${String(iterMonth + 1).padStart(2, '0')}`;
      const monthName = iterDate.toLocaleString('default', { month: 'short' });
      
      chartData.push({
        name: `${monthName} ${iterYear}`,
        revenue: revenueMap.get(monthStr) || 0
      });

      iterMonth++;
      if (iterMonth > 11) {
        iterMonth = 0;
        iterYear++;
      }
    }

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