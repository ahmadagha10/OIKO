import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RewardClaim from '@/models/RewardClaim';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';
import { IUser } from '@/models/User';

// POST /api/rewards/claim - Claim a reward
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
    const { rewardType } = body;

    // Validate reward type
    if (!rewardType || !['free_product', 'discount', 'cashback'].includes(rewardType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid reward type',
        },
        { status: 400 }
      );
    }

    // Get user's current points
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

    const currentPoints = currentUser.fragmentPoints || 0;

    // Check if user has enough points (need 100 points to claim)
    if (currentPoints < 100) {
      return NextResponse.json(
        {
          success: false,
          error: 'Insufficient points',
          message: `You need 100 points to claim a reward. Current points: ${currentPoints}`,
        },
        { status: 400 }
      );
    }

    // Create reward claim record
    const rewardClaim = await RewardClaim.create({
      userId: user._id,
      pointsUsed: 100,
      rewardType,
      status: 'pending',
      claimedAt: new Date(),
    });

    // Reset user's points to 0
    currentUser.fragmentPoints = 0;
    await currentUser.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          claim: rewardClaim,
          message: 'Reward claimed successfully! Your points have been reset. We will contact you to fulfill your reward.',
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error claiming reward:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to claim reward',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
