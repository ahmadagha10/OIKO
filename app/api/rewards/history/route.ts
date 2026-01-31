import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RewardClaim from '@/models/RewardClaim';
import { requireAuth } from '@/lib/auth';
import { IUser } from '@/models/User';

// GET /api/rewards/history - Get user's reward claim history
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) {
      return authResult;
    }
    const user = authResult as IUser;

    await connectDB();

    // Get all reward claims for this user
    const claims = await RewardClaim.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (error: any) {
    console.error('Error fetching reward history:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch reward history',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
