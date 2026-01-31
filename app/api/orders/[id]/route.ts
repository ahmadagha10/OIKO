import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';
import { requireAdmin } from '@/lib/auth';
import { sendOrderShippedEmail, sendOrderDeliveredEmail } from '@/lib/email';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/orders/:id - Get single order by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid order ID',
        },
        { status: 400 }
      );
    }

    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch order',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/:id - Update order status (Admin only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Check admin authentication
    const authResult = await requireAdmin(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid order ID',
        },
        { status: 400 }
      );
    }

    // Get the order before updating to check status change
    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found',
        },
        { status: 404 }
      );
    }

    // Only allow updating specific fields
    const allowedUpdates: any = {};
    if (body.status) allowedUpdates.status = body.status;
    if (body.paymentStatus) allowedUpdates.paymentStatus = body.paymentStatus;
    if (body.trackingNumber !== undefined) allowedUpdates.trackingNumber = body.trackingNumber;
    if (body.trackingUrl !== undefined) allowedUpdates.trackingUrl = body.trackingUrl;

    const order = await Order.findByIdAndUpdate(id, allowedUpdates, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found',
        },
        { status: 404 }
      );
    }

    // Send email notifications if status changed
    const statusChanged = existingOrder.status !== order.status;
    if (statusChanged) {
      const customerEmail = order.customerInfo.email;
      const orderRef = order.orderRef;

      if (order.status === 'shipped') {
        // Send shipped email asynchronously
        sendOrderShippedEmail({
          to: customerEmail,
          orderRef,
          trackingNumber: order.trackingNumber,
          trackingUrl: order.trackingUrl,
        }).catch((error) => {
          console.error('Failed to send shipped email:', error);
        });
      } else if (order.status === 'delivered') {
        // Send delivered email asynchronously
        sendOrderDeliveredEmail({
          to: customerEmail,
          orderRef,
        }).catch((error) => {
          console.error('Failed to send delivered email:', error);
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update order',
        message: error.message,
      },
      { status: 400 }
    );
  }
}
