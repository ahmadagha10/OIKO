import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/auth';

// POST /api/admin/products/bulk - Bulk product operations
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await requireAdmin(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    await connectDB();

    const body = await request.json();
    const { operation, productIds, updates } = body;

    if (!operation) {
      return NextResponse.json(
        {
          success: false,
          error: 'Operation is required',
        },
        { status: 400 }
      );
    }

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product IDs array is required',
        },
        { status: 400 }
      );
    }

    let result;

    switch (operation) {
      case 'delete':
        // Delete multiple products
        result = await Product.deleteMany({
          _id: { $in: productIds },
        });

        return NextResponse.json({
          success: true,
          message: `${result.deletedCount} products deleted successfully`,
          data: {
            deletedCount: result.deletedCount,
          },
        });

      case 'update':
        // Update multiple products
        if (!updates || typeof updates !== 'object') {
          return NextResponse.json(
            {
              success: false,
              error: 'Updates object is required for update operation',
            },
            { status: 400 }
          );
        }

        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { $set: updates }
        );

        return NextResponse.json({
          success: true,
          message: `${result.modifiedCount} products updated successfully`,
          data: {
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
          },
        });

      case 'updateStock':
        // Update stock for multiple products
        if (typeof updates?.stock !== 'number') {
          return NextResponse.json(
            {
              success: false,
              error: 'Stock value is required for updateStock operation',
            },
            { status: 400 }
          );
        }

        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { $set: { stock: updates.stock } }
        );

        return NextResponse.json({
          success: true,
          message: `Stock updated for ${result.modifiedCount} products`,
          data: {
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
          },
        });

      case 'toggleFeatured':
        // Toggle featured status for multiple products
        const products = await Product.find({ _id: { $in: productIds } });

        const updatePromises = products.map((product) =>
          Product.findByIdAndUpdate(product._id, {
            featured: !product.featured,
          })
        );

        await Promise.all(updatePromises);

        return NextResponse.json({
          success: true,
          message: `Featured status toggled for ${products.length} products`,
          data: {
            updatedCount: products.length,
          },
        });

      case 'setCategory':
        // Set category for multiple products
        if (!updates?.category) {
          return NextResponse.json(
            {
              success: false,
              error: 'Category is required for setCategory operation',
            },
            { status: 400 }
          );
        }

        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { $set: { category: updates.category } }
        );

        return NextResponse.json({
          success: true,
          message: `Category updated for ${result.modifiedCount} products`,
          data: {
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
          },
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown operation: ${operation}`,
            message: 'Valid operations: delete, update, updateStock, toggleFeatured, setCategory',
          },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Error performing bulk operation:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform bulk operation',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
