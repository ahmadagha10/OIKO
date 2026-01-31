import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import { requireAuth } from '@/lib/auth';
import { IUser } from '@/models/User';

// GET /api/wishlist - Get user's wishlist with product details
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) {
      return authResult;
    }
    const user = authResult as IUser;

    await connectDB();

    const currentUser = await User.findById(user._id).select('wishlist');

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // Get product details for wishlist items
    const products = await Product.find({
      _id: { $in: currentUser.wishlist },
    }).lean();

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: any) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch wishlist',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/wishlist - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) {
      return authResult;
    }
    const user = authResult as IUser;

    await connectDB();

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID is required',
        },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    const currentUser = await User.findById(user._id);

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // Check if already in wishlist
    if (currentUser.wishlist.includes(productId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product already in wishlist',
        },
        { status: 400 }
      );
    }

    // Add to wishlist
    currentUser.wishlist.push(productId);
    await currentUser.save();

    return NextResponse.json({
      success: true,
      data: {
        productId,
        wishlistCount: currentUser.wishlist.length,
      },
      message: 'Product added to wishlist',
    });
  } catch (error: any) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add to wishlist',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
