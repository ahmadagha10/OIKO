import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  birthday?: string;
  role: 'customer' | 'admin';
  fragmentPoints: number;
  profilePhoto?: {
    url: string;
    publicId: string;
  };
  addresses: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
    isDefault: boolean;
  }[];
  wishlist: string[]; // Array of product IDs
  cart: {
    productId: string;
    quantity: number;
    size?: string;
    color?: string;
    addedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AddressSchema = new Schema({
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
    default: 'Saudi Arabia',
  },
  latitude: Number,
  longitude: Number,
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const CartItemSchema = new Schema({
  productId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  size: String,
  color: String,
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    birthday: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    profilePhoto: {
      url: String,
      publicId: String,
    },
    fragmentPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    addresses: {
      type: [AddressSchema],
      default: [],
    },
    wishlist: {
      type: [String],
      default: [],
    },
    cart: {
      type: [CartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Note: email index is already created by unique: true in the schema
// No need for explicit index

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
