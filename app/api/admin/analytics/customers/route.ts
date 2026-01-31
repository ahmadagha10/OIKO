import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/auth';

// GET /api/admin/analytics/customers - Get customer analytics (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await requireAdmin(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30days';

    // Calculate date range
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
        start = new Date(0);
        break;
    }

    const dateFilter = period !== 'all' ? { createdAt: { $gte: start } } : {};

    // Total customers
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // New customers in period
    const newCustomers = await User.countDocuments({
      role: 'customer',
      ...dateFilter,
    });

    // Customer acquisition over time
    const customerAcquisition = await User.aggregate([
      { $match: { role: 'customer', ...dateFilter } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          newCustomers: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    // Top customers by revenue
    const topCustomers = await Order.aggregate([
      { $match: { paymentStatus: 'paid', ...dateFilter } },
      {
        $group: {
          _id: '$userId',
          email: { $first: '$customerInfo.email' },
          firstName: { $first: '$customerInfo.firstName' },
          lastName: { $first: '$customerInfo.lastName' },
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 20 },
    ]);

    // Customer lifetime value distribution
    const lifetimeValueDistribution = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: '$userId',
          totalSpent: { $sum: '$totalAmount' },
        },
      },
      {
        $bucket: {
          groupBy: '$totalSpent',
          boundaries: [0, 100, 500, 1000, 5000, 10000, Infinity],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            avgSpent: { $avg: '$totalSpent' },
          },
        },
      },
    ]);

    // Repeat customer rate
    const customerOrderCounts = await Order.aggregate([
      { $match: { paymentStatus: 'paid', ...dateFilter } },
      {
        $group: {
          _id: '$userId',
          orderCount: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          repeatCustomers: {
            $sum: { $cond: [{ $gt: ['$orderCount', 1] }, 1, 0] },
          },
        },
      },
    ]);

    const repeatCustomerRate =
      customerOrderCounts.length > 0
        ? (customerOrderCounts[0].repeatCustomers / customerOrderCounts[0].totalCustomers) * 100
        : 0;

    // Average order count per customer
    const avgOrdersPerCustomer = await Order.aggregate([
      { $match: { paymentStatus: 'paid', ...dateFilter } },
      {
        $group: {
          _id: '$userId',
          orderCount: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          avgOrders: { $avg: '$orderCount' },
        },
      },
    ]);

    // Customer segments by order count
    const customerSegments = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: '$userId',
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
        },
      },
      {
        $bucket: {
          groupBy: '$orderCount',
          boundaries: [1, 2, 5, 10, Infinity],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            avgSpent: { $avg: '$totalSpent' },
          },
        },
      },
    ]);

    // Customer fragments points distribution
    const fragmentsDistribution = await User.aggregate([
      { $match: { role: 'customer' } },
      {
        $bucket: {
          groupBy: '$fragmentPoints',
          boundaries: [0, 30, 70, 100, Infinity],
          default: 'Other',
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalCustomers,
          newCustomers,
          repeatCustomerRate: Math.round(repeatCustomerRate * 100) / 100,
          avgOrdersPerCustomer:
            avgOrdersPerCustomer.length > 0
              ? Math.round(avgOrdersPerCustomer[0].avgOrders * 100) / 100
              : 0,
        },
        customerAcquisition,
        topCustomers,
        lifetimeValueDistribution,
        customerSegments,
        fragmentsDistribution,
      },
      period,
    });
  } catch (error: any) {
    console.error('Error fetching customer analytics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch customer analytics',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
