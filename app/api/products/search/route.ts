import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET /api/products/search - Advanced product search with faceted filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
    const colors = searchParams.get('colors')?.split(',').filter(Boolean);
    const sizes = searchParams.get('sizes')?.split(',').filter(Boolean);
    const featured = searchParams.get('featured');
    const inStock = searchParams.get('inStock');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;

    // Build query
    const query: any = {};

    // Text search
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      if (category === 'accessories') {
        query.category = { $in: ['hats', 'socks', 'totebags'] };
      } else {
        query.category = category;
      }
    }

    // Price range
    if (minPrice > 0 || maxPrice < 999999) {
      query.price = {
        $gte: minPrice,
        $lte: maxPrice,
      };
    }

    // Colors filter
    if (colors && colors.length > 0) {
      query.colors = { $in: colors };
    }

    // Sizes filter
    if (sizes && sizes.length > 0) {
      query.sizes = { $in: sizes };
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Stock filter
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Determine sort order
    let sort: any = {};
    switch (sortBy) {
      case 'price_asc':
        sort = { price: 1 };
        break;
      case 'price_desc':
        sort = { price: -1 };
        break;
      case 'name':
        sort = { name: sortOrder };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'relevance':
      default:
        sort = { featured: -1, createdAt: -1 };
        break;
    }

    // Get total count
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    // Get products
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get facets (available filters)
    const facets = await Product.aggregate([
      { $match: query },
      {
        $facet: {
          categories: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          priceRange: [
            {
              $group: {
                _id: null,
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
              },
            },
          ],
          colors: [
            { $unwind: '$colors' },
            { $group: { _id: '$colors', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          sizes: [
            { $unwind: '$sizes' },
            { $group: { _id: '$sizes', count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      facets: {
        categories: facets[0]?.categories || [],
        priceRange: facets[0]?.priceRange[0] || { minPrice: 0, maxPrice: 0 },
        colors: facets[0]?.colors || [],
        sizes: facets[0]?.sizes || [],
      },
      query: {
        q,
        category,
        minPrice,
        maxPrice,
        colors,
        sizes,
        featured,
        inStock,
        sortBy,
      },
    });
  } catch (error: any) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search products',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
