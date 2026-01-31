import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import { requireAuth } from '@/lib/auth';
import { IUser } from '@/models/User';

// GET /api/cart - Get user's cart with product details
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) {
      return authResult;
    }
    const user = authResult as IUser;

    await connectDB();

    const currentUser = await User.findById(user._id).select('cart');

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // Get product details for cart items
    const productIds = currentUser.cart.map((item: any) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    // Merge cart items with product details
    const cartWithDetails = currentUser.cart.map((item: any) => {
      const product = products.find((p) => p._id.toString() === item.productId);
      return {
        _id: item._id,
        product,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        addedAt: item.addedAt,
      };
    });

    return NextResponse.json({
      success: true,
      count: cartWithDetails.length,
      data: cartWithDetails,
    });
  } catch (error: any) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cart',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
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
    const { productId, quantity, size, color } = body;

    if (!productId || !quantity) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID and quantity are required',
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

    // Check if same product with same size/color exists
    const existingItem = currentUser.cart.find(
      (item: any) =>
        item.productId === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
    } else {
      // Add new item
      currentUser.cart.push({
        productId,
        quantity,
        size,
        color,
        addedAt: new Date(),
      });
    }

    await currentUser.save();

    return NextResponse.json({
      success: true,
      data: {
        cartCount: currentUser.cart.length,
      },
      message: 'Product added to cart',
    });
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add to cart',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear cart
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) {
      return authResult;
    }
    const user = authResult as IUser;

    await connectDB();

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

    currentUser.cart = [];
    await currentUser.save();

    return NextResponse.json({
      success: true,
      message: 'Cart cleared',
    });
  } catch (error: any) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear cart',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
