import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { globalErrorHandler } from './middlewares/errorHandler';
import { AppError } from './utils/AppError';
import userRoutes from './modules/user/user.route';
import productRoutes from './modules/product/product.route';
import saleRoutes from './modules/sale/sale.route';
import dashboardRoutes from './modules/dashboard/dashboard.route';
import customerRoutes from './modules/customer/customer.route';
import categoryRoutes from './modules/category/category.route';

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/categories', categoryRoutes);
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'ERP API is running perfectly!',
  });
});

app.use((req: Request, res: Response, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;