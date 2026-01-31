import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';

// POST /api/newsletter/unsubscribe - Unsubscribe from newsletter
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email is required',
        },
        { status: 400 }
      );
    }

    // Find subscriber
    const subscriber = await Subscriber.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email not found in subscription list',
        },
        { status: 404 }
      );
    }

    if (subscriber.status === 'unsubscribed') {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already unsubscribed',
        },
        { status: 400 }
      );
    }

    // Unsubscribe
    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    });
  } catch (error: any) {
    console.error('Error unsubscribing from newsletter:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to unsubscribe',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
