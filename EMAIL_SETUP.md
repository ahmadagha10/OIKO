# Email Setup Guide

This project uses [Resend](https://resend.com) for sending transactional emails.

## Email Types

The following emails are automatically sent:

1. **Welcome Email** - Sent when a user signs up
2. **Order Confirmation** - Sent when an order is placed

## Setup Instructions

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key

1. Go to [API Keys](https://resend.com/api-keys) in your Resend dashboard
2. Click "Create API Key"
3. Give it a name (e.g., "Oiko Production")
4. Copy the API key (starts with `re_`)

### 3. Configure Your Domain (Optional but Recommended)

For production, you should use your own domain:

1. Go to [Domains](https://resend.com/domains) in Resend
2. Click "Add Domain"
3. Enter your domain (e.g., `oiko.store`)
4. Add the DNS records shown to your domain provider
5. Wait for verification (usually takes a few minutes)

**For development**, you can use Resend's test domain:
- From: `onboarding@resend.dev`
- You can only send to your own verified email address

### 4. Add API Key to Environment Variables

Update your `.env.local` file:

```bash
# Resend Email Service
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@oiko.store  # Use onboarding@resend.dev for development
```

### 5. Test Email Sending

1. Restart your dev server: `npm run dev`
2. Try signing up with a new account
3. Check your inbox for the welcome email
4. Try placing an order
5. Check your inbox for the order confirmation

## Email Templates

Email templates are located in `/components/emails/`:

- `WelcomeEmail.tsx` - Welcome email for new users
- `OrderConfirmed.tsx` - Order confirmation email
- `OrderShipped.tsx` - Shipped notification (future)
- `OrderDelivered.tsx` - Delivery confirmation (future)
- `RewardUnlocked.tsx` - Reward unlock notification (future)

## Customization

### Change Email Content

Edit the template files in `/components/emails/` to customize:
- Text content
- Styling
- Call-to-action buttons
- Brand colors

### Change Sender Name/Email

Update in `.env.local`:

```bash
EMAIL_FROM=hello@oiko.store  # Change to your preferred email
```

### Add New Email Types

1. Create a new template in `/components/emails/`
2. Add a new function in `/lib/email.ts`
3. Call the function where needed in your API routes

## Troubleshooting

### Emails Not Sending

1. Check that `RESEND_API_KEY` is set in `.env.local`
2. Make sure you restarted the dev server after adding the API key
3. Check the server logs for error messages
4. In development, you can only send to verified email addresses

### Email Goes to Spam

For production:
1. Set up a custom domain in Resend
2. Add SPF, DKIM, and DMARC records
3. Use a professional "from" address (not noreply if possible)
4. Warm up your domain by sending gradually increasing volumes

### Rate Limits

Resend free tier includes:
- 100 emails per day
- 1 email per second

For higher volumes, upgrade to a paid plan.

## Monitoring

Check email delivery status in your [Resend dashboard](https://resend.com/emails):
- View sent emails
- Check delivery status
- See bounce/complaint rates
- Monitor API usage

## Support

- Resend Documentation: https://resend.com/docs
- Resend Support: https://resend.com/support
- GitHub Issues: https://github.com/resendlabs/resend-node
