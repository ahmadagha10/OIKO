import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/auth';

// GET /api/admin/analytics/sales - Get sales analytics (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await requireAdmin(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30days'; // 7days, 30days, 90days, 1year, all
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Calculate date range
    let dateFilter: any = {};

    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    } else {
      const now = new Date();
      let start = new Date();

      switch (period) {
        case '7days':
          start.setDate(now.getDate() - 7);
          break;
        case '30days':
          start.setDate(now.getDate() - 30);
          break;
        case '90days':
          start.setDate(now.getDate() - 90);
          break;
        case '1year':
          start.setFullYear(now.getFullYear() - 1);
          break;
        case 'all':
          start = new Date(0); // Beginning of time
          break;
      }

      if (period !== 'all') {
        dateFilter = { createdAt: { $gte: start } };
      }
    }

    // Revenue over time
    const revenueOverTime = await Order.aggregate([
      { $match: { paymentStatus: 'paid', ...dateFilter } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    // Top products by revenue
    const topProducts = await Order.aggregate([
      { $match: { paymentStatus: 'paid', ...dateFilter } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$items.productName' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          quantitySold: { $sum: '$items.quantity' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]);

    // Revenue by category
    const revenueByCategory = await Order.aggregate([
      { $match: { paymentStatus: 'paid', ...dateFilter } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.category',
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orders: { $addToSet: '$_id' },
        },
      },
      {
        $project: {
          _id: 1,
          revenue: 1,
          orderCount: { $size: '$orders' },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    // Overall stats
    const overallStats = await Order.aggregate([
      { $match: { paymentStatus: 'paid', ...dateFilter } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' },
        },
      },
    ]);

    // Payment status breakdown
    const paymentStatusBreakdown = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
    ]);

    // Order status breakdown
    const orderStatusBreakdown = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        overview: overallStats[0] || {
          totalRevenue: 0,
          totalOrders: 0,
          avgOrderValue: 0,
        },
        revenueOverTime,
        topProducts,
        revenueByCategory,
        paymentStatusBreakdown: paymentStatusBreakdown.reduce((acc: any, item: any) => {
          acc[item._id] = { count: item.count, revenue: item.revenue };
          return acc;
        }, {}),
        orderStatusBreakdown: orderStatusBreakdown.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
      period,
      dateRange: dateFilter.createdAt ? {
        start: dateFilter.createdAt.$gte,
        end: dateFilter.createdAt.$lte || new Date(),
      } : null,
    });
  } catch (error: any) {
    console.error('Error fetching sales analytics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch sales analytics',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
