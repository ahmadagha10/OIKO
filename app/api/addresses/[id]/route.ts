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

// PATCH /api/addresses/:id - Update address
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

    // Find address by _id
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

    // Update fields
    if (body.street !== undefined) address.street = body.street;
    if (body.city !== undefined) address.city = body.city;
    if (body.zipCode !== undefined) address.zipCode = body.zipCode;
    if (body.country !== undefined) address.country = body.country;
    if (body.latitude !== undefined) address.latitude = body.latitude;
    if (body.longitude !== undefined) address.longitude = body.longitude;

    // If setting as default, unset all others
    if (body.isDefault === true) {
      currentUser.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
      address.isDefault = true;
    }

    await currentUser.save();

    return NextResponse.json({
      success: true,
      data: address,
      message: 'Address updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update address',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/addresses/:id - Delete address
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

    const wasDefault = address.isDefault;

    // Remove address
    currentUser.addresses.pull(id);

    // If deleted address was default, set first remaining address as default
    if (wasDefault && currentUser.addresses.length > 0) {
      currentUser.addresses[0].isDefault = true;
    }

    await currentUser.save();

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete address',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
