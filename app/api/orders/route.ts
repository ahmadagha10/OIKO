import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { sendOrderConfirmationEmail } from '@/lib/email';

// GET /api/orders - Get orders (by email for now, by userId later with auth)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const orderRef = searchParams.get('orderRef');

    // Build query
    const query: any = {};

    if (email) {
      query['customerInfo.email'] = email.toLowerCase();
    }

    if (orderRef) {
      query.orderRef = orderRef;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.orderRef || !body.customerInfo || !body.items || body.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Generate unique order reference if not provided
    if (!body.orderRef) {
      body.orderRef = `WR-${Date.now().toString().slice(-6)}`;
    }

    // Set default payment status
    body.paymentStatus = body.paymentStatus || 'pending';
    body.status = body.status || 'pending';

    // Check stock availability and reduce stock for each item (if products exist in DB)
    const Product = (await import('@/models/Product')).default;

    for (const item of body.items) {
      // Try to find product in database
      // Note: This might fail if using local hardcoded products with numeric IDs
      // that haven't been migrated to MongoDB yet
      let product = null;

      try {
        // Only attempt to find if productId looks like a MongoDB ObjectId (24 hex chars)
        if (item.productId && /^[a-f\d]{24}$/i.test(item.productId)) {
          product = await Product.findById(item.productId);
        }
      } catch (err) {
        // Product not found in database - this is OK if using local products
        console.log(`Product ${item.productId} not in database, skipping stock check`);
      }

      // Only validate stock if product exists in database
      if (product) {
        // Check if enough stock available
        if (product.stock !== undefined && product.stock < item.quantity) {
          return NextResponse.json(
            {
              success: false,
              error: `Insufficient stock for ${item.productName}. Available: ${product.stock}, Requested: ${item.quantity}`,
            },
            { status: 400 }
          );
        }

        // Reduce stock
        if (product.stock !== undefined) {
          product.stock -= item.quantity;
          await product.save();
        }
      }
    }

    const order = await Order.create(body);

    // Send order confirmation email (don't wait for it, send asynchronously)
    sendOrderConfirmationEmail({
      to: body.customerInfo.email,
      orderRef: order.orderRef,
      orderPoints: body.pointsEarned || 0,
      orderUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/account`,
    }).catch((error) => {
      console.error('Failed to send order confirmation email:', error);
      // Don't fail the order if email fails
    });

    return NextResponse.json(
      {
        success: true,
        data: order,
        message: 'Order created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create order',
        message: error.message,
      },
      { status: 400 }
    );
  }
}
