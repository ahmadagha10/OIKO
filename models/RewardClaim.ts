import mongoose, { Schema, Document } from 'mongoose';

export interface IRewardClaim extends Document {
  userId: mongoose.Types.ObjectId;
  pointsUsed: number;
  rewardType: 'free_product' | 'discount' | 'cashback';
  status: 'pending' | 'fulfilled' | 'cancelled';
  claimedAt: Date;
  fulfilledAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RewardClaimSchema = new Schema<IRewardClaim>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    pointsUsed: {
      type: Number,
      required: true,
      min: 0,
    },
    rewardType: {
      type: String,
      enum: ['free_product', 'discount', 'cashback'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'fulfilled', 'cancelled'],
      default: 'pending',
    },
    claimedAt: {
      type: Date,
      default: Date.now,
    },
    fulfilledAt: Date,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
RewardClaimSchema.index({ userId: 1, createdAt: -1 });
RewardClaimSchema.index({ status: 1 });

export default mongoose.models.RewardClaim || mongoose.model<IRewardClaim>('RewardClaim', RewardClaimSchema);
