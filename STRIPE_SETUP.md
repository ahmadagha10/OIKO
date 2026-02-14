# Stripe Payment Setup Guide

This guide will help you set up Stripe payment processing for OIKO.

## 1. Create a Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Click "Sign up" and create an account
3. Complete the account verification process

## 2. Get API Keys

### For Development (Test Mode)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test mode** (toggle in top right)
3. Go to **Developers** > **API keys**
4. Copy your keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - Click "Reveal test key"

### Add to Environment Variables

Add to your `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

## 3. Set Up Webhook Endpoint

Webhooks allow Stripe to notify your app about payment events.

### Local Development Testing

1. Install Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret (starts with `whsec_`)

5. Add to `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

### Production Webhook Setup

1. Go to **Developers** > **Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Enter your endpoint URL: `https://oikaofit.com/api/webhooks/stripe`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the **Signing secret**
6. Add to production environment variables

## 4. Test Payment Flow

### Test Card Numbers

Use these test cards in development:

| Card Number | Description |
|------------|-------------|
| 4242 4242 4242 4242 | Succeeds |
| 4000 0000 0000 9995 | Declined |
| 4000 0025 0000 3155 | Requires authentication (3D Secure) |

- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

### Testing Steps

1. Start your dev server: `npm run dev`
2. Start webhook forwarding: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Add items to cart
4. Go to checkout
5. Use a test card number
6. Complete payment
7. Verify order is created and email is sent

## 5. API Endpoints

The following Stripe-related endpoints are implemented:

### Create Payment Intent
```
POST /api/checkout/create-payment-intent
```

**Request:**
```json
{
  "items": [
    {
      "id": "product_id",
      "name": "Product Name",
      "price": 199,
      "quantity": 1
    }
  ],
  "shipping": 25
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "amount": 22400
  }
}
```

### Verify Payment
```
POST /api/checkout/verify-payment
```

**Request:**
```json
{
  "paymentIntentId": "pi_xxx",
  "orderData": {
    "customerInfo": { ... },
    "items": [ ... ]
  }
}
```

### Webhook Handler
```
POST /api/webhooks/stripe
```

Handles Stripe webhook events automatically.

## 6. Go Live Checklist

Before switching to production:

1. **Complete Stripe account verification**
   - Submit business details
   - Verify bank account
   - Complete tax information

2. **Switch to live mode**
   - Toggle to **Live mode** in dashboard
   - Get live API keys (starts with `pk_live_` and `sk_live_`)
   - Update production environment variables

3. **Set up production webhook**
   - Add production endpoint in Stripe dashboard
   - Update `STRIPE_WEBHOOK_SECRET` in production

4. **Configure payment methods**
   - Enable desired payment methods in Stripe dashboard
   - Configure currency settings (SAR for Saudi Arabia)

5. **Test in production**
   - Make a small real payment
   - Verify webhook delivery
   - Check order creation

6. **Set up monitoring**
   - Enable Stripe email notifications
   - Set up alerts for failed payments
   - Monitor webhook delivery

## 7. Currency & Localization

For Saudi Arabia:

```typescript
// In your payment intent creation
{
  currency: 'sar', // Saudi Riyal
  amount: convertToStripeAmount(224), // 224 SAR = 22400 halalas
}
```

## 8. Security Best Practices

✅ **Do:**
- Always use HTTPS in production
- Validate webhook signatures
- Use environment variables for keys
- Never expose secret keys to frontend
- Use Payment Intents (not Charges API)

❌ **Don't:**
- Don't commit API keys to git
- Don't use test keys in production
- Don't skip webhook signature verification
- Don't store full card numbers

## 9. Troubleshooting

### Webhook not working
- Check that webhook forwarding is running (`stripe listen`)
- Verify webhook secret is correct
- Check server logs for errors
- Ensure endpoint is publicly accessible (for production)

### Payment fails
- Check API keys are correct
- Verify amount is in smallest currency unit (halalas for SAR)
- Check Stripe dashboard for error details
- Review server logs

### 3D Secure issues
- Test with 3D Secure test cards
- Ensure your Stripe.js integration supports SCA
- Check that payment confirmation is handled properly

## 10. Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Testing Guide](https://stripe.com/docs/testing)
- [Webhook Guide](https://stripe.com/docs/webhooks)
- [Payment Intents](https://stripe.com/docs/payments/payment-intents)

## Support

For issues:
- Stripe Support: https://support.stripe.com
- Stripe Community: https://github.com/stripe
