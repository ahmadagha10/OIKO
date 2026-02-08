import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export default cloudinary;

/**
 * Upload image to Cloudinary
 */
export async function uploadImage(
  file: string | Buffer,
  folder: string,
  options?: {
    public_id?: string;
    overwrite?: boolean;
    resource_type?: 'raw' | 'auto' | 'image' | 'video';
  }
): Promise<{
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}> {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return {
        success: false,
        error: 'Cloudinary not configured',
      };
    }

    const result = await cloudinary.uploader.upload(file as string, {
      folder,
      ...options,
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload image',
    };
  }
}

/**
 * Delete image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return {
        success: false,
        error: 'Cloudinary not configured',
      };
    }

    await cloudinary.uploader.destroy(publicId);

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete image',
    };
  }
}

/**
 * Generate signed upload URL for direct client uploads
 */
export function generateSignedUploadUrl(
  folder: string,
  timestamp?: number
): {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
} {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
  const apiKey = process.env.CLOUDINARY_API_KEY || '';
  const ts = timestamp || Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: ts,
      folder,
    },
    process.env.CLOUDINARY_API_SECRET || ''
  );

  return {
    signature,
    timestamp: ts,
    cloudName,
    apiKey,
    folder,
  };
}
