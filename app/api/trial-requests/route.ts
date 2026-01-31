import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TrialRequest from '@/models/TrialRequest';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';
import { IUser } from '@/models/User';

// POST /api/trial-requests - Create trial request
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
    const { productType, size } = body;

    // Validate required fields
    if (!productType || !size) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product type and size are required',
        },
        { status: 400 }
      );
    }

    // Get user details
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

    // Get default address
    const defaultAddress = currentUser.addresses.find((addr: any) => addr.isDefault) || currentUser.addresses[0];

    if (!defaultAddress) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please add an address to your profile first',
        },
        { status: 400 }
      );
    }

    // Check if city is Riyadh
    if (!defaultAddress.city.toLowerCase().includes('riyadh')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Try Before You Buy is only available in Riyadh',
        },
        { status: 400 }
      );
    }

    // Check if user has any pending trial requests
    const pendingRequest = await TrialRequest.findOne({
      userId: user._id,
      status: { $in: ['pending', 'approved', 'delivered'] },
    });

    if (pendingRequest) {
      return NextResponse.json(
        {
          success: false,
          error: 'You already have an active trial request. Please return it before requesting another.',
        },
        { status: 400 }
      );
    }

    // Create trial request
    const trialRequest = await TrialRequest.create({
      userId: user._id,
      customerInfo: {
        email: currentUser.email,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        phone: currentUser.phone,
        street: defaultAddress.street,
        city: defaultAddress.city,
        zipCode: defaultAddress.zipCode,
        country: defaultAddress.country,
      },
      productType,
      size,
      status: 'pending',
      agreedToTerms: true,
    });

    return NextResponse.json(
      {
        success: true,
        data: trialRequest,
        message: 'Trial request submitted successfully! We will contact you within 24 hours.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating trial request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create trial request',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// GET /api/trial-requests - Get user's trial requests
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) {
      return authResult;
    }
    const user = authResult as IUser;

    await connectDB();

    const trialRequests = await TrialRequest.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: trialRequests.length,
      data: trialRequests,
    });
  } catch (error: any) {
    console.error('Error fetching trial requests:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch trial requests',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
