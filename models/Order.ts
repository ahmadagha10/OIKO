import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string; // Changed from ObjectId to string to support hardcoded product IDs
  productName: string;
  productImage: string;
  category?: string; // Added for analytics
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface ICustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface IOrder extends Document {
  orderRef: string;
  customerInfo: ICustomerInfo;
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  pointsEarned: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  paymentIntentId?: string; // Stripe payment intent ID
  trackingNumber?: string;
  trackingUrl?: string;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: String, // Changed from ObjectId to String to support hardcoded product IDs
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
  category: String, // Added for analytics
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  size: String,
  color: String,
});

const CustomerInfoSchema = new Schema<ICustomerInfo>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  latitude: Number,
  longitude: Number,
});

const OrderSchema = new Schema<IOrder>(
  {
    orderRef: {
      type: String,
      required: true,
      unique: true,
    },
    customerInfo: {
      type: CustomerInfoSchema,
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: 'Order must have at least one item',
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shipping: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    pointsEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: String,
    paymentIntentId: String, // Stripe payment intent ID for webhook tracking
    trackingNumber: String,
    trackingUrl: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
// Note: orderRef index is already created by unique: true in the schema
OrderSchema.index({ 'customerInfo.email': 1 });
OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
