import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { sendEmail } from '@/lib/email';
import { render } from '@react-email/render';
import PasswordResetEmail from '@/components/emails/password-reset-email';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    // Don't reveal if user exists or not (security best practice)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists, a password reset email has been sent',
      });
    }

    // Create reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_API_URL}/reset-password?token=${resetToken}`;

    // Send email
    const emailHtml = await render(
      PasswordResetEmail({
        name: user.firstName,
        resetUrl,
      })
    );

    await sendEmail({
      to: user.email,
      subject: 'Reset your OIKO password',
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: 'If an account exists, a password reset email has been sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
