import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({
          success: true,
          message: 'Already subscribed',
        });
      } else {
        // Reactivate subscription
        existing.isActive = true;
        existing.subscribedAt = new Date();
        await existing.save();

        return NextResponse.json({
          success: true,
          message: 'Subscription reactivated',
        });
      }
    }

    // Create new subscriber
    const subscriber = await Subscriber.create({
      email: email.toLowerCase(),
      isActive: true,
      subscribedAt: new Date(),
    });

    // Send welcome email (async, don't wait)
    sendEmail({
      to: email,
      subject: 'Welcome to OIKO Newsletter',
      html: getWelcomeNewsletterHTML(),
    }).catch((error) => {
      console.error('Failed to send welcome newsletter email:', error);
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: { email: subscriber.email },
    });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}

// Unsubscribe endpoint
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const subscriber = await Subscriber.findOne({ email: email.toLowerCase() });
    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: 'Email not found' },
        { status: 404 }
      );
    }

    subscriber.isActive = false;
    await subscriber.save();

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    });
  } catch (error: any) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}

function getWelcomeNewsletterHTML(): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to OIKO Newsletter</title>
      </head>
      <body style="margin: 0; padding: 32px 16px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111111; background-color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 16px; padding: 32px;">
          <div style="font-size: 12px; letter-spacing: 0.28em; text-transform: uppercase; color: #6b6b6b;">Oiko Newsletter</div>
          <h1 style="margin: 16px 0 12px; font-size: 22px; font-weight: 600;">Stay in the Loop</h1>
          <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.7; color: #2f2f2f;">
            Thank you for subscribing to OIKO.
          </p>
          <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.7; color: #2f2f2f;">
            You'll be the first to know about:
          </p>
          <ul style="margin: 0 0 12px; padding-left: 20px; font-size: 14px; line-height: 1.7; color: #2f2f2f;">
            <li>New product drops</li>
            <li>Exclusive offers</li>
            <li>Style tips and inspiration</li>
            <li>Behind-the-scenes content</li>
          </ul>
          <p style="margin: 16px 0 0; font-size: 12px; line-height: 1.6; color: #6b6b6b;">
            We respect your inbox. Expect quality over quantity.
          </p>
          <a href="${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/products" style="display: inline-block; margin-top: 20px; padding: 12px 18px; border: 1px solid #111111; border-radius: 999px; color: #111111; text-decoration: none; font-size: 14px; font-weight: 600;">
            Explore Collection
          </a>
        </div>
      </body>
    </html>
  `;
}
