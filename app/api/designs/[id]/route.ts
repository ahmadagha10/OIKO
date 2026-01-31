import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Design from '@/models/Design';
import { requireAuth } from '@/lib/auth';
import { IUser } from '@/models/User';
import { deleteImage } from '@/lib/cloudinary';
import mongoose from 'mongoose';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/designs/:id - Get specific design
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) {
      return authResult;
    }
    const user = authResult as IUser;

    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid design ID',
        },
        { status: 400 }
      );
    }

    const design = await Design.findById(id).lean();

    if (!design) {
      return NextResponse.json(
        {
          success: false,
          error: 'Design not found',
        },
        { status: 404 }
      );
    }

    // Verify ownership
    if (design.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized access',
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: design,
    });
  } catch (error: any) {
    console.error('Error fetching design:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch design',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/designs/:id - Delete design
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) {
      return authResult;
    }
    const user = authResult as IUser;

    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid design ID',
        },
        { status: 400 }
      );
    }

    const design = await Design.findById(id);

    if (!design) {
      return NextResponse.json(
        {
          success: false,
          error: 'Design not found',
        },
        { status: 404 }
      );
    }

    // Verify ownership
    if (design.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized access',
        },
        { status: 403 }
      );
    }

    // Delete associated images from Cloudinary
    for (const image of design.images) {
      if (image.publicId) {
        await deleteImage(image.publicId);
      }
    }

    // Delete design
    await Design.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Design deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting design:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete design',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
