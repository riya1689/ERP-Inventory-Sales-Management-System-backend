import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  productImage: string;
  totalSold: number;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    purchasePrice: {
      type: Number,
      required: [true, 'Purchase price is required'],
      min: [0, 'Price cannot be negative'],
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Price cannot be negative'],
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
    },
    productImage: {
      type: String,
      required: [true, 'Product image is required'],
    },
    totalSold: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', productSchema);