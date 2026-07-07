import { Request, Response, NextFunction } from 'express';
import { Customer } from './customer.model';
import { QueryBuilder } from '../../utils/QueryBuilder';

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const baseQuery = Customer.find();
    
    const queryBuilder = new QueryBuilder(baseQuery, req.query)
      .search(['name', 'phoneNumber'])
      .filter()
      .sort()
      .paginate();

    const customers = await queryBuilder.modelQuery;
    const total = await Customer.countDocuments(queryBuilder.modelQuery.getFilter());

    res.status(200).json({
      status: 'success',
      results: customers.length,
      data: {
        customers,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};
