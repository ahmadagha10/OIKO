import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TrialRequest from '@/models/TrialRequest';
import { requireAuth } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import type { IUser } from '@/models/User';

// POST /api/trial-requests - Create a trial request
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const user = authResult as IUser;

    const body = await request.json();

    if (!body.productType || !body.size || !body.color || !body.address) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { address } = body;
    if (!address.street || !address.city || !address.phone) {
      return NextResponse.json(
        { success: false, error: 'Incomplete address information' },
        { status: 400 }
      );
    }

    if (address.city.toLowerCase() !== 'riyadh') {
      return NextResponse.json(
        { success: false, error: 'Trial program is currently only available in Riyadh' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingRequest = await TrialRequest.findOne({
      userId: user._id,
      status: 'pending',
    });

    if (existingRequest) {
      return NextResponse.json(
        { success: false, error: 'You already have a pending trial request' },
        { status: 400 }
      );
    }

    const trialRequest = await TrialRequest.create({
      userId: user._id,
      productType: body.productType,
      size: body.size,
      color: body.color,
      address: {
        street: address.street,
        city: address.city,
        state: address.state || '',
        zipCode: address.zipCode || '',
        country: address.country || 'Saudi Arabia',
        phone: address.phone,
      },
      status: 'pending',
      notes: body.notes || '',
    });

    sendEmail({
      to: user.email,
      subject: 'Trial Request Received - OIKO',
      html: `<h1>Trial request received for ${body.productType}</h1>`,
    }).catch(console.error);

    return NextResponse.json(
      { success: true, message: 'Trial request submitted successfully', data: trialRequest },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating trial request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create trial request' },
      { status: 500 }
    );
  }
}

// GET /api/trial-requests
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const user = authResult as IUser;

    await connectDB();
    const requests = await TrialRequest.find({ userId: user._id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: requests });
  } catch (error: any) {
    console.error('Error fetching trial requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trial requests' },
      { status: 500 }
    );
  }
}
