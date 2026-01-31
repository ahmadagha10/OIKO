import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';
import { IUser } from '@/models/User';

interface RouteParams {
  params: Promise<{
    productId: string;
  }>;
}

// DELETE /api/wishlist/:productId - Remove item from wishlist
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) {
      return authResult;
    }
    const user = authResult as IUser;

    await connectDB();

    const { productId } = await params;

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

    // Check if product is in wishlist
    const index = currentUser.wishlist.indexOf(productId);
    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not in wishlist',
        },
        { status: 404 }
      );
    }

    // Remove from wishlist
    currentUser.wishlist.splice(index, 1);
    await currentUser.save();

    return NextResponse.json({
      success: true,
      data: {
        productId,
        wishlistCount: currentUser.wishlist.length,
      },
      message: 'Product removed from wishlist',
    });
  } catch (error: any) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to remove from wishlist',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
