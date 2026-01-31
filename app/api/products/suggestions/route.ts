import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET /api/products/suggestions - Get search suggestions/autocomplete
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '5');

    if (!q || q.length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Query must be at least 2 characters',
      });
    }

    // Search for matching products
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ],
    })
      .select('name category image price')
      .limit(limit)
      .lean();

    // Get unique categories that match
    const categories = await Product.distinct('category', {
      category: { $regex: q, $options: 'i' },
    });

    // Format suggestions
    const suggestions = {
      products: products.map((p) => ({
        type: 'product',
        id: p._id,
        name: p.name,
        category: p.category,
        image: p.image,
        price: p.price,
      })),
      categories: categories.map((cat) => ({
        type: 'category',
        name: cat,
        query: cat,
      })),
    };

    return NextResponse.json({
      success: true,
      data: suggestions,
      query: q,
    });
  } catch (error: any) {
    console.error('Error getting suggestions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get suggestions',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
