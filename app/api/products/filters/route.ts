import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET /api/products/filters - Get available filter options
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get all available filter options
    const filters = await Product.aggregate([
      {
        $facet: {
          categories: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
            {
              $project: {
                _id: 0,
                name: '$_id',
                count: 1,
              },
            },
          ],
          priceRange: [
            {
              $group: {
                _id: null,
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                avgPrice: { $avg: '$price' },
              },
            },
          ],
          colors: [
            { $unwind: '$colors' },
            { $group: { _id: '$colors', count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
            {
              $project: {
                _id: 0,
                name: '$_id',
                count: 1,
              },
            },
          ],
          sizes: [
            { $unwind: '$sizes' },
            { $group: { _id: '$sizes', count: { $sum: 1 } } },
            // Custom sort for sizes (S, M, L, XL, XXL)
            {
              $addFields: {
                sortOrder: {
                  $switch: {
                    branches: [
                      { case: { $eq: ['$_id', 'XS'] }, then: 0 },
                      { case: { $eq: ['$_id', 'S'] }, then: 1 },
                      { case: { $eq: ['$_id', 'M'] }, then: 2 },
                      { case: { $eq: ['$_id', 'L'] }, then: 3 },
                      { case: { $eq: ['$_id', 'XL'] }, then: 4 },
                      { case: { $eq: ['$_id', 'XXL'] }, then: 5 },
                    ],
                    default: 99,
                  },
                },
              },
            },
            { $sort: { sortOrder: 1 } },
            {
              $project: {
                _id: 0,
                name: '$_id',
                count: 1,
              },
            },
          ],
          totalProducts: [{ $count: 'count' }],
          featuredCount: [
            { $match: { featured: true } },
            { $count: 'count' },
          ],
          inStockCount: [
            { $match: { stock: { $gt: 0 } } },
            { $count: 'count' },
          ],
        },
      },
    ]);

    const result = filters[0];

    return NextResponse.json({
      success: true,
      data: {
        categories: result.categories || [],
        priceRange: result.priceRange[0] || {
          minPrice: 0,
          maxPrice: 0,
          avgPrice: 0,
        },
        colors: result.colors || [],
        sizes: result.sizes || [],
        stats: {
          totalProducts: result.totalProducts[0]?.count || 0,
          featuredCount: result.featuredCount[0]?.count || 0,
          inStockCount: result.inStockCount[0]?.count || 0,
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching filters:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch filters',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
