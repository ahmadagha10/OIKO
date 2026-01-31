import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';

// POST /api/newsletter/subscribe - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, name, source } = body;

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

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide a valid email address',
        },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });

    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return NextResponse.json(
          {
            success: false,
            error: 'Email already subscribed',
          },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        existingSubscriber.status = 'active';
        existingSubscriber.subscribedAt = new Date();
        existingSubscriber.unsubscribedAt = undefined;
        if (name) existingSubscriber.name = name;
        await existingSubscriber.save();

        return NextResponse.json({
          success: true,
          data: existingSubscriber,
          message: 'Subscription reactivated successfully',
        });
      }
    }

    // Create new subscriber
    const subscriber = await Subscriber.create({
      email: email.toLowerCase(),
      name,
      source: source || 'website',
      status: 'active',
      subscribedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        data: subscriber,
        message: 'Successfully subscribed to newsletter',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to subscribe',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
