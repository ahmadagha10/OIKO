import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { deleteImage } from '@/lib/cloudinary';
import { IUser } from '@/models/User';

interface RouteParams {
  params: Promise<{
    publicId: string;
  }>;
}

// DELETE /api/upload/:publicId - Delete image
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) {
      return authResult;
    }
    const user = authResult as IUser;

    const { publicId } = await params;

    if (!publicId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Public ID is required',
        },
        { status: 400 }
      );
    }

    // Decode the public ID (it comes URL-encoded)
    const decodedPublicId = decodeURIComponent(publicId);

    // Check if user owns this image (for designs) or is admin (for products)
    const isUserImage = decodedPublicId.includes(`designs/${user._id}`);
    const isAdmin = user.role === 'admin';

    if (!isUserImage && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized to delete this image',
        },
        { status: 403 }
      );
    }

    const result = await deleteImage(decodedPublicId);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to delete image',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete image',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
