import mongoose, { Schema, Document } from 'mongoose';

export interface ITrialRequest extends Document {
  userId?: mongoose.Types.ObjectId;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  productType: 'tshirt' | 'hoodie';
  size: string;
  status: 'pending' | 'approved' | 'delivered' | 'returned' | 'cancelled' | 'charged';
  deliveredAt?: Date;
  expectedReturnDate?: Date;
  returnedAt?: Date;
  notes?: string;
  agreedToTerms: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TrialRequestSchema = new Schema<ITrialRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    customerInfo: {
      email: {
        type: String,
        required: true,
        lowercase: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    productType: {
      type: String,
      enum: ['tshirt', 'hoodie'],
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'delivered', 'returned', 'cancelled', 'charged'],
      default: 'pending',
    },
    deliveredAt: Date,
    expectedReturnDate: Date,
    returnedAt: Date,
    notes: String,
    agreedToTerms: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
TrialRequestSchema.index({ userId: 1, createdAt: -1 });
TrialRequestSchema.index({ status: 1 });
TrialRequestSchema.index({ 'customerInfo.email': 1 });

export default mongoose.models.TrialRequest || mongoose.model<ITrialRequest>('TrialRequest', TrialRequestSchema);
