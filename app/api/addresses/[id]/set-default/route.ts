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

// PATCH /api/addresses/:id/set-default - Set address as default
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

    // Find address
    const address = currentUser.addresses.id(id);

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          error: 'Address not found',
        },
        { status: 404 }
      );
    }

    // Unset all defaults
    currentUser.addresses.forEach((addr: any) => {
      addr.isDefault = false;
    });

    // Set this address as default
    address.isDefault = true;

    await currentUser.save();

    return NextResponse.json({
      success: true,
      data: address,
      message: 'Default address updated',
    });
  } catch (error: any) {
    console.error('Error setting default address:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to set default address',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
