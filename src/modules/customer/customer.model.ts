import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  phoneNumber: string;
  totalPurchases: number; // total quantity of products bought
}

const customerSchema = new Schema<ICustomer>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
    },
    totalPurchases: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Customer = mongoose.model<ICustomer>('Customer', customerSchema);
