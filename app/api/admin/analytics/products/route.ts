import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/auth';

// GET /api/admin/analytics/products - Get product performance analytics (admin only)
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
    const category = searchParams.get('category');

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

    // Product inventory overview
    const inventoryOverview = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          avgStock: { $avg: '$stock' },
          lowStockCount: {
            $sum: { $cond: [{ $lte: ['$stock', 10] }, 1, 0] },
          },
          outOfStockCount: {
            $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] },
          },
        },
      },
    ]);

    // Best selling products
    const bestSelling = await Order.aggregate([
      { $match: { paymentStatus: 'paid', ...dateFilter } },
      { $unwind: '$items' },
      ...(category ? [{ $match: { 'items.category': category } }] : []),
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$items.productName' },
          category: { $first: '$items.category' },
          quantitySold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 20 },
    ]);

    // Worst performing products (low sales)
    const worstPerforming = await Order.aggregate([
      { $match: { paymentStatus: 'paid', ...dateFilter } },
      { $unwind: '$items' },
      ...(category ? [{ $match: { 'items.category': category } }] : []),
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$items.productName' },
          category: { $first: '$items.category' },
          quantitySold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { quantitySold: 1 } },
      { $limit: 20 },
    ]);

    // Sales by category
    const salesByCategory = await Order.aggregate([
      { $match: { paymentStatus: 'paid', ...dateFilter } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.category',
          quantitySold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orderCount: { $addToSet: '$_id' },
        },
      },
      {
        $project: {
          _id: 1,
          quantitySold: 1,
          revenue: 1,
          orderCount: { $size: '$orderCount' },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    // Popular colors (from orders)
    const popularColors = await Order.aggregate([
      { $match: { paymentStatus: 'paid', ...dateFilter } },
      { $unwind: '$items' },
      { $match: { 'items.color': { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$items.color',
          count: { $sum: '$items.quantity' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Popular sizes (from orders)
    const popularSizes = await Order.aggregate([
      { $match: { paymentStatus: 'paid', ...dateFilter } },
      { $unwind: '$items' },
      { $match: { 'items.size': { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$items.size',
          count: { $sum: '$items.quantity' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Low stock products
    const lowStockProducts = await Product.find({
      stock: { $lte: 10, $gt: 0 },
    })
      .select('name category stock price')
      .sort({ stock: 1 })
      .limit(20)
      .lean();

    // Out of stock products
    const outOfStockProducts = await Product.find({ stock: 0 })
      .select('name category price')
      .lean();

    // Products never sold
    const soldProductIds = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
        },
      },
    ]);

    const soldIds = soldProductIds.map((item) => item._id);
    const neverSoldProducts = await Product.find({
      _id: { $nin: soldIds },
    })
      .select('name category stock price')
      .limit(20)
      .lean();

    // Average price by category
    const avgPriceByCategory = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          productCount: { $sum: 1 },
        },
      },
      { $sort: { avgPrice: -1 } },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        inventoryOverview: inventoryOverview[0] || {
          totalProducts: 0,
          totalStock: 0,
          avgStock: 0,
          lowStockCount: 0,
          outOfStockCount: 0,
        },
        bestSelling,
        worstPerforming,
        salesByCategory,
        popularColors,
        popularSizes,
        lowStockProducts,
        outOfStockProducts,
        neverSoldProducts,
        avgPriceByCategory,
      },
      period,
      category,
    });
  } catch (error: any) {
    console.error('Error fetching product analytics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product analytics',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
