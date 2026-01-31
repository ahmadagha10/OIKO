import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Design from '@/models/Design';
import { requireAuth } from '@/lib/auth';
import { IUser } from '@/models/User';

// GET /api/designs - Get user's custom designs
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) {
      return authResult;
    }
    const user = authResult as IUser;

    await connectDB();

    const designs = await Design.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: designs.length,
      data: designs,
    });
  } catch (error: any) {
    console.error('Error fetching designs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch designs',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/designs - Save custom design
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
    const { productId, productType, images, preview, name } = body;

    // Validate required fields
    if (!productId || !productType) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID and product type are required',
        },
        { status: 400 }
      );
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'At least one design image is required',
        },
        { status: 400 }
      );
    }

    // Create design
    const design = await Design.create({
      userId: user._id,
      productId,
      productType,
      images,
      preview,
      name: name || `Custom ${productType} Design`,
    });

    return NextResponse.json(
      {
        success: true,
        data: design,
        message: 'Design saved successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error saving design:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save design',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
