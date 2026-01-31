import mongoose, { Schema, Document } from 'mongoose';

export interface IDesignImage {
  url: string;
  publicId: string;
  position: {
    x: number;
    y: number;
  };
  rotation: number;
  scale: number;
}

export interface IDesign extends Document {
  userId: mongoose.Types.ObjectId;
  productId: string;
  productType: 'hoodie' | 'tshirt';
  images: IDesignImage[];
  preview?: string; // Preview image URL
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DesignImageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  position: {
    x: {
      type: Number,
      required: true,
      default: 0,
    },
    y: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  rotation: {
    type: Number,
    default: 0,
  },
  scale: {
    type: Number,
    default: 1,
  },
});

const DesignSchema = new Schema<IDesign>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    productId: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      enum: ['hoodie', 'tshirt'],
      required: true,
    },
    images: {
      type: [DesignImageSchema],
      default: [],
    },
    preview: String,
    name: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
DesignSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Design || mongoose.model<IDesign>('Design', DesignSchema);
