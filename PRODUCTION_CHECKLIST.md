# Production Launch Checklist

## 🔐 Security & Environment

### Environment Variables
- [ ] Copy `.env.production.example` to `.env.production`
- [ ] Set strong `JWT_SECRET` (use: `openssl rand -base64 32`)
- [ ] Configure production MongoDB URI
- [ ] Set `NEXT_PUBLIC_API_URL` to production domain
- [ ] Add Resend API key and verify sender domain
- [ ] Add Stripe live keys (not test keys!)
- [ ] Set Stripe webhook secret
- [ ] Add Cloudinary credentials

### Security Checks
- [ ] JWT_SECRET is unique and never committed to git
- [ ] MongoDB uses strong password
- [ ] MongoDB IP whitelist configured (or 0.0.0.0/0 for cloud)
- [ ] Stripe webhook endpoint configured in Stripe dashboard
- [ ] CORS configured if needed
- [ ] Rate limiting enabled on API routes (recommended)

---

## 💳 Payment Setup (Stripe)

### Stripe Dashboard Setup
1. [ ] Go to https://dashboard.stripe.com
2. [ ] Switch to "Live mode" (toggle in sidebar)
3. [ ] Get live API keys: Developers → API keys
   - [ ] Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - [ ] Copy **Secret key** → `STRIPE_SECRET_KEY`
4. [ ] Configure webhook:
   - [ ] Go to: Developers → Webhooks
   - [ ] Add endpoint: `https://oikaofit.com/api/webhooks/stripe`
   - [ ] Select events:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded`
   - [ ] Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET`

### Test Payment Flow
- [ ] Create test order with Stripe test card (4242 4242 4242 4242)
- [ ] Verify order created in database
- [ ] Verify payment status updates
- [ ] Verify confirmation email sent
- [ ] Verify fragment points awarded

---

## 📧 Email Setup (Resend)

### Resend Configuration
1. [ ] Go to https://resend.com/domains
2. [ ] Add and verify your domain (oikaofit.com)
3. [ ] Add DNS records (SPF, DKIM, DMARC)
4. [ ] Wait for verification (can take up to 48 hours)
5. [ ] Get API key from https://resend.com/api-keys
6. [ ] Test email sending with:
   ```bash
   curl -X POST https://oikaofit.com/api/newsletter/subscribe \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

### Email Templates to Test
- [ ] Order confirmation
- [ ] Shipping update
- [ ] Delivery confirmation
- [ ] Password reset
- [ ] Newsletter welcome
- [ ] Trial request confirmation

---

## 🗄️ Database Setup

### MongoDB Atlas
- [ ] Create production cluster
- [ ] Set up database user with strong password
- [ ] Configure IP whitelist (0.0.0.0/0 for cloud or specific IPs)
- [ ] Enable backup (recommended)
- [ ] Set up monitoring alerts

### Database Indexes
Run these commands in MongoDB shell:
```javascript
use oiko-production

// Users
db.users.createIndex({ email: 1 }, { unique: true })

// Products
db.products.createIndex({ category: 1 })
db.products.createIndex({ featured: 1 })

// Orders
db.orders.createIndex({ orderRef: 1 }, { unique: true })
db.orders.createIndex({ userId: 1 })
db.orders.createIndex({ status: 1 })
db.orders.createIndex({ createdAt: -1 })

// Subscribers
db.subscribers.createIndex({ email: 1 }, { unique: true })
```

### Seed Database
- [ ] Run: `npm run seed` to populate products
- [ ] Verify products in database
- [ ] Create admin user manually in MongoDB

---

## 🚀 Cloudflare Workers Deployment

### Configure Secrets
```bash
# Set each secret
wrangler secret put MONGODB_URI
wrangler secret put JWT_SECRET
wrangler secret put RESEND_API_KEY
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET
wrangler secret put CLOUDINARY_API_SECRET
```

### Deploy
```bash
# Install dependencies
npm install --legacy-peer-deps

# Build
npm run build

# Deploy
npx opennextjs-cloudflare deploy
```

### Verify Deployment
- [ ] Check deployment status in Cloudflare dashboard
- [ ] Visit https://oikaofit.com
- [ ] Test all pages load
- [ ] Check browser console for errors

---

## 🎨 Frontend Optimizations

### Performance
- [ ] Images optimized (using Next.js Image component)
- [ ] Fonts loaded efficiently
- [ ] No console errors in production
- [ ] Lighthouse score > 90

### SEO
- [ ] Add `robots.txt`
- [ ] Add `sitemap.xml`
- [ ] Meta tags on all pages
- [ ] Open Graph images
- [ ] Structured data (JSON-LD)

### Analytics
- [ ] Google Analytics installed
- [ ] Meta Pixel installed (if using ads)
- [ ] Conversion tracking configured

---

## 🧪 Testing Checklist

### User Flows
- [ ] **Homepage** → loads with products
- [ ] **Product Page** → shows details, add to cart works
- [ ] **Cart** → displays items, update quantity works
- [ ] **Checkout** → form validation, payment processing
- [ ] **Order Success** → confirmation page shows
- [ ] **Account** → login, signup, order history
- [ ] **Admin Dashboard** → accessible with admin account

### Payment Testing
- [ ] Test successful payment
- [ ] Test failed payment (use 4000 0000 0000 0002)
- [ ] Test webhook receiving
- [ ] Verify email sent
- [ ] Verify order status updated
- [ ] Verify stock reduced

### Email Testing
- [ ] Order confirmation
- [ ] Newsletter subscription
- [ ] Password reset
- [ ] Trial request

### Mobile Testing
- [ ] Test on iPhone Safari
- [ ] Test on Android Chrome
- [ ] Navigation works
- [ ] Forms are usable
- [ ] Payment works on mobile

---

## 🔍 Monitoring & Maintenance

### Error Monitoring (Optional but Recommended)
- [ ] Set up Sentry or similar
- [ ] Configure error alerts
- [ ] Set up uptime monitoring (e.g., UptimeRobot)

### Logs
- [ ] Check Cloudflare Workers logs
- [ ] Check MongoDB Atlas logs
- [ ] Monitor Stripe dashboard for payments

### Backups
- [ ] MongoDB automatic backups enabled
- [ ] Code backed up in GitHub
- [ ] Environment variables documented securely

---

## 📱 Social Media & Marketing

- [ ] Update Instagram bio with website link
- [ ] Update TikTok profile
- [ ] Create launch posts
- [ ] Prepare email campaign (if have subscribers)

---

## 🎯 Launch Day

### Pre-Launch (1 hour before)
- [ ] Final test of all features
- [ ] Clear browser cache and test
- [ ] Check all environment variables set
- [ ] Verify Stripe webhooks working
- [ ] Send test order to yourself

### Launch
- [ ] Announce on social media
- [ ] Send announcement email (if applicable)
- [ ] Monitor error logs closely
- [ ] Watch for user feedback

### Post-Launch (24 hours)
- [ ] Check order flow is working
- [ ] Review error logs
- [ ] Monitor payment success rate
- [ ] Check email delivery rate
- [ ] Respond to customer inquiries

---

## 📞 Support

### Customer Support Preparation
- [ ] Set up support email (support@oikaofit.com)
- [ ] Create FAQ page if needed
- [ ] Prepare response templates
- [ ] Test contact form

---

## ✅ Final Verification

Before announcing launch:
- [ ] Can place a real order end-to-end
- [ ] Payment works and money received in Stripe
- [ ] Order confirmation email arrives
- [ ] Order appears in admin dashboard
- [ ] Stock inventory updates
- [ ] Mobile experience is smooth
- [ ] Site loads in under 3 seconds
- [ ] No broken links
- [ ] All images load correctly
- [ ] Social media links work

---

## 🎉 You're Ready to Launch!

Once all items are checked, your site is production-ready. Good luck with the launch!

Remember:
- Monitor closely for the first 48 hours
- Be ready to quickly fix any issues
- Listen to customer feedback
- Iterate and improve continuously
