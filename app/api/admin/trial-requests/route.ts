import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TrialRequest from '@/models/TrialRequest';
import { requireAdmin } from '@/lib/auth';

// GET /api/admin/trial-requests - Get all trial requests (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await requireAdmin(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build query
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { 'customerInfo.email': { $regex: search, $options: 'i' } },
        { 'customerInfo.firstName': { $regex: search, $options: 'i' } },
        { 'customerInfo.lastName': { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count
    const totalRequests = await TrialRequest.countDocuments(query);
    const totalPages = Math.ceil(totalRequests / limit);

    // Get trial requests
    const trialRequests = await TrialRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'email firstName lastName')
      .lean();

    // Get status counts
    const statusCounts = await TrialRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: trialRequests,
      pagination: {
        page,
        limit,
        totalRequests,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      stats: {
        statusBreakdown: statusCounts.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
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
