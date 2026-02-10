import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import stripe from '@/lib/stripe';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { sendOrderConfirmationEmail } from '@/lib/email';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(failedPayment);
        break;

      case 'charge.refunded':
        const refund = event.data.object as Stripe.Charge;
        await handleRefund(refund);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    await connectDB();

    // Find order by payment intent ID
    const order = await Order.findOne({
      paymentIntentId: paymentIntent.id,
    });

    if (!order) {
      console.error('Order not found for payment intent:', paymentIntent.id);
      return;
    }

    // Update order status
    order.paymentStatus = 'paid';
    order.status = 'processing';
    await order.save();

    // Update user's fragment points if user exists
    if (order.userId) {
      const user = await User.findById(order.userId);
      if (user) {
        user.fragmentPoints = (user.fragmentPoints || 0) + (order.pointsEarned || 0);
        await user.save();
      }
    }

    // Send confirmation email
    if (order.customerInfo?.email) {
      await sendOrderConfirmationEmail({
        to: order.customerInfo.email,
        orderRef: order.orderRef,
        orderPoints: order.pointsEarned || 0,
        orderUrl: `${process.env.NEXT_PUBLIC_API_URL}/account`,
      }).catch((error) => {
        console.error('Failed to send order confirmation email:', error);
      });
    }

    console.log('Payment succeeded and order updated:', order.orderRef);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    await connectDB();

    const order = await Order.findOne({
      paymentIntentId: paymentIntent.id,
    });

    if (order) {
      order.paymentStatus = 'failed';
      order.status = 'cancelled';
      await order.save();

      console.log('Payment failed for order:', order.orderRef);
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handleRefund(charge: Stripe.Charge) {
  try {
    await connectDB();

    const order = await Order.findOne({
      paymentIntentId: charge.payment_intent,
    });

    if (order) {
      order.paymentStatus = 'refunded';
      order.status = 'cancelled';
      await order.save();

      // Deduct fragment points from user
      if (order.userId) {
        const user = await User.findById(order.userId);
        if (user && order.pointsEarned) {
          user.fragmentPoints = Math.max(
            0,
            (user.fragmentPoints || 0) - order.pointsEarned
          );
          await user.save();
        }
      }

      console.log('Refund processed for order:', order.orderRef);
    }
  } catch (error) {
    console.error('Error handling refund:', error);
  }
}
