import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';
import { IUser } from '@/models/User';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PATCH /api/cart/:id - Update cart item quantity
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) {
      return authResult;
    }
    const user = authResult as IUser;

    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid quantity is required',
        },
        { status: 400 }
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

    // Find cart item
    const cartItem = currentUser.cart.id(id);

    if (!cartItem) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cart item not found',
        },
        { status: 404 }
      );
    }

    // Update quantity
    cartItem.quantity = quantity;
    await currentUser.save();

    return NextResponse.json({
      success: true,
      data: cartItem,
      message: 'Cart item updated',
    });
  } catch (error: any) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update cart item',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/:id - Remove item from cart
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) {
      return authResult;
    }
    const user = authResult as IUser;

    await connectDB();

    const { id } = await params;

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

    // Find cart item
    const cartItem = currentUser.cart.id(id);

    if (!cartItem) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cart item not found',
        },
        { status: 404 }
      );
    }

    // Remove item
    currentUser.cart.pull(id);
    await currentUser.save();

    return NextResponse.json({
      success: true,
      data: {
        cartCount: currentUser.cart.length,
      },
      message: 'Cart item removed',
    });
  } catch (error: any) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to remove cart item',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
