import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { IUser } from '@/models/User';

// GET /api/auth/me - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);

    // If requireAuth returns a Response, it means authentication failed
    if (authResult instanceof Response) {
      return authResult;
    }

    const user = authResult as IUser;

    return NextResponse.json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        fragmentPoints: user.fragmentPoints,
        addresses: user.addresses,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get user profile',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH /api/auth/me - Update current user profile
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);

    if (authResult instanceof Response) {
      return authResult;
    }

    const user = authResult as IUser;
    const body = await request.json();

    // Only allow updating certain fields
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'fragmentPoints'];
    const updates: any = {};

    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    // Validate fragmentPoints if provided
    if (updates.fragmentPoints !== undefined) {
      const points = Number(updates.fragmentPoints);
      if (Number.isNaN(points) || points < 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid fragment points value',
          },
          { status: 400 }
        );
      }
      updates.fragmentPoints = Math.min(points, 100); // Cap at 100
    }

    // Update user
    Object.assign(user, updates);
    await user.save();

    return NextResponse.json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        fragmentPoints: user.fragmentPoints,
        addresses: user.addresses,
        updatedAt: user.updatedAt,
      },
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update profile',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
