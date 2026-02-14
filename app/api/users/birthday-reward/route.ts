import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { IUser } from '@/models/User';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';
import { sendBirthdayEmail } from '@/lib/email';

/**
 * POST /api/users/birthday-reward
 * Claim birthday reward (50 bonus points)
 * Protected route - requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const authenticatedUser = authResult as IUser;

    await connectDB();

    // Get full user data
    const user = await User.findById(authenticatedUser._id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has a birthday set
    if (!user.birthday) {
      return NextResponse.json(
        { success: false, error: 'No birthday set in profile' },
        { status: 400 }
      );
    }

    // Check if today is the user's birthday
    const today = new Date();
    const birthday = new Date(user.birthday);

    const isBirthday =
      today.getMonth() === birthday.getMonth() &&
      today.getDate() === birthday.getDate();

    if (!isBirthday) {
      return NextResponse.json(
        { success: false, error: 'Birthday reward can only be claimed on your birthday' },
        { status: 400 }
      );
    }

    // Check if user has already claimed birthday reward this year
    const lastClaimYear = user.lastBirthdayRewardYear || 0;
    const currentYear = today.getFullYear();

    if (lastClaimYear === currentYear) {
      return NextResponse.json(
        { success: false, error: 'Birthday reward already claimed this year' },
        { status: 400 }
      );
    }

    // Award birthday points
    const BIRTHDAY_BONUS = 50;
    user.fragmentPoints += BIRTHDAY_BONUS;
    user.lastBirthdayRewardYear = currentYear;
    await user.save();

    // Send birthday email
    try {
      await sendBirthdayEmail({
        email: user.email,
        firstName: user.firstName,
        pointsAwarded: BIRTHDAY_BONUS,
      });
    } catch (emailError) {
      console.error('Failed to send birthday email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      data: {
        pointsAwarded: BIRTHDAY_BONUS,
        newTotal: user.fragmentPoints,
      },
      message: `Happy Birthday! ${BIRTHDAY_BONUS} bonus points added to your account!`,
    });
  } catch (error) {
    console.error('Birthday reward error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to claim birthday reward' },
      { status: 500 }
    );
  }
}
