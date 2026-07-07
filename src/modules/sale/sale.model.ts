import mongoose, { Document, Schema } from 'mongoose';

interface ISaleItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  total: number;
}

export interface ISale extends Document {
  invoiceNumber: string;
  items: ISaleItem[];
  subTotal: number;
  discount: number;
  grandTotal: number;
  paymentMethod: 'Cash' | 'Card' | 'MobileBanking';
  soldBy: mongoose.Types.ObjectId;
}

const saleItemSchema = new Schema<ISaleItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const saleSchema = new Schema<ISale>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    items: [saleItemSchema],
    subTotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'MobileBanking'],
      default: 'Cash',
    },
    soldBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Sale = mongoose.model<ISale>('Sale', saleSchema);