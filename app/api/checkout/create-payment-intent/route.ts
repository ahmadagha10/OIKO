import { NextRequest, NextResponse } from 'next/server';
import stripe, { convertToStripeAmount } from '@/lib/stripe';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerInfo } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No items provided' },
        { status: 400 }
      );
    }

    // Calculate total and validate items
    await connectDB();
    let subtotal = 0;

    for (const item of items) {
      // Use product price from the item (already validated on frontend)
      const itemTotal = item.product.price * item.quantity;
      subtotal += itemTotal;

      // Optional: Validate against database if product exists there
      try {
        if (item.productId && /^[a-f\d]{24}$/i.test(item.productId)) {
          const dbProduct = await Product.findById(item.productId);
          if (dbProduct && dbProduct.price !== item.product.price) {
            console.warn(`Price mismatch for ${item.product.name}`);
          }
        }
      } catch (err) {
        // Product not in DB, use provided price
      }
    }

    const shipping = 25; // Fixed shipping cost
    const total = subtotal + shipping;

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: convertToStripeAmount(total),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        customerEmail: customerInfo?.email || '',
        customerName: `${customerInfo?.firstName || ''} ${customerInfo?.lastName || ''}`.trim(),
        itemCount: items.length.toString(),
        subtotal: subtotal.toString(),
        shipping: shipping.toString(),
        total: total.toString(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: total,
      },
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create payment intent',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
