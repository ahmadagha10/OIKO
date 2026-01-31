import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';
import { IUser } from '@/models/User';

// GET /api/addresses - Get user's addresses
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) {
      return authResult;
    }
    const user = authResult as IUser;

    await connectDB();

    const currentUser = await User.findById(user._id).select('addresses');

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      count: currentUser.addresses.length,
      data: currentUser.addresses,
    });
  } catch (error: any) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch addresses',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/addresses - Add new address
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
    const { street, city, zipCode, country, latitude, longitude, isDefault } = body;

    // Validate required fields
    if (!street || !city || !zipCode || !country) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Street, city, zipCode, and country are required',
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

    // If this is set as default, unset all other defaults
    if (isDefault) {
      currentUser.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    // Add new address
    const newAddress = {
      street,
      city,
      zipCode,
      country,
      latitude,
      longitude,
      isDefault: isDefault || currentUser.addresses.length === 0, // First address is default
    };

    currentUser.addresses.push(newAddress);
    await currentUser.save();

    // Get the newly added address
    const addedAddress = currentUser.addresses[currentUser.addresses.length - 1];

    return NextResponse.json(
      {
        success: true,
        data: addedAddress,
        message: 'Address added successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error adding address:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add address',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
