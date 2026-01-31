# 🚀 Oiko Backend - Quick Start Guide

I've set up your complete backend! Here's what you need to do to get it running:

## What's Been Done ✅

1. **Backend Infrastructure**
   - MongoDB connection utility
   - 3 Database models (Product, Order, User)
   - API routes for Products and Orders
   - Seed script to populate database

2. **Frontend Integration**
   - API utility functions in `lib/api.ts`
   - Checkout now uses real API calls
   - Orders saved to MongoDB database

## Your 3-Step Setup

### Step 1: MongoDB Atlas (I've opened it in your browser) 🌐

**Follow the checklist in `SETUP_CHECKLIST.md`**

Quick version:
1. Sign up at MongoDB Atlas (already open in browser)
2. Create FREE cluster (M0 tier)
3. Create database user with password
4. Whitelist IP: 0.0.0.0/0
5. Get connection string

**Time:** 5 minutes

### Step 2: Configure Environment ⚙️

Edit `.env.local` and add your MongoDB connection string:

```bash
# Open in your editor
code .env.local
```

Replace this line:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/oiko?retryWrites=true&w=majority
```

With YOUR actual string from MongoDB Atlas.

**Time:** 1 minute

### Step 3: Seed Database & Start 🌱

```bash
# Populate database with products
npm run seed

# Start development server
npm run dev
```

**Time:** 1 minute

---

## Verify It's Working ✓

### Test 1: API Endpoints
```bash
# Get all products
curl http://localhost:3000/api/products

# Get hoodies
curl http://localhost:3000/api/products?category=hoodies
```

### Test 2: Create an Order
1. Go to http://localhost:3000
2. Add products to cart
3. Go to checkout
4. Fill out the form
5. Click "Complete Payment"

✅ Order will be saved to MongoDB!

### Test 3: View in Database
1. Go to MongoDB Atlas Dashboard
2. Click "Browse Collections"
3. See your `orders` collection with your order!

---

## What's Changed in Your Code

### Before (localStorage only):
```typescript
localStorage.setItem("oiko_orders", JSON.stringify(orders));
```

### After (Real database!):
```typescript
const response = await createOrder(orderData);
// Order saved to MongoDB Atlas ✨
```

---

## File Structure

```
oiko/
├── app/
│   └── api/
│       ├── products/
│       │   ├── route.ts           # GET, POST /api/products
│       │   └── [id]/route.ts      # GET, PUT, DELETE /api/products/:id
│       └── orders/
│           ├── route.ts           # GET, POST /api/orders
│           └── [id]/route.ts      # GET, PATCH /api/orders/:id
├── lib/
│   ├── mongodb.ts                 # Database connection
│   └── api.ts                     # API utility functions (NEW!)
├── models/
│   ├── Product.ts                 # Product schema
│   ├── Order.ts                   # Order schema
│   └── User.ts                    # User schema
├── scripts/
│   └── seed-products.ts           # Database seeder
├── .env.local                     # Your MongoDB URI goes here
├── .env.example                   # Template
├── SETUP_CHECKLIST.md             # Step-by-step guide
└── BACKEND_SETUP.md               # Detailed docs
```

---

## Available npm Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run seed     # Seed database with products
npm run lint     # Run ESLint
```

---

## API Endpoints Reference

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products?category=hoodies` | Filter by category |
| GET | `/api/products?search=cozy` | Search products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders?email=user@example.com` | Filter by email |
| GET | `/api/orders?orderRef=WR-123456` | Filter by order ref |
| GET | `/api/orders/:id` | Get single order |
| POST | `/api/orders` | Create new order |
| PATCH | `/api/orders/:id` | Update order status (admin) |

---

## Common Issues & Solutions

### "Cannot connect to MongoDB"
✅ Check `.env.local` has correct MONGODB_URI
✅ Check MongoDB Atlas → Network Access (whitelist 0.0.0.0/0)
✅ Check username/password in connection string

### "npm run seed" fails
✅ Make sure MongoDB cluster is running (not paused)
✅ Wait a few minutes after creating cluster
✅ Try running again

### Orders not showing in database
✅ Check browser console for errors
✅ Check Network tab in DevTools
✅ Verify checkout completed successfully

---

## Next Steps

Once your backend is running, you can:

1. **View Orders** - Check MongoDB Atlas to see real orders
2. **Add Authentication** - User login/signup (NextAuth.js recommended)
3. **Add Payments** - Stripe or Telr integration
4. **Email Notifications** - Send order confirmations
5. **Admin Panel** - Manage products and orders

---

## Need Help?

📖 **Detailed Guide:** See `SETUP_CHECKLIST.md`
📖 **Backend Docs:** See `BACKEND_SETUP.md`
🌐 **MongoDB Docs:** https://docs.atlas.mongodb.com/

---

## 🎉 You're Almost There!

Just 3 steps:
1. ✅ Set up MongoDB Atlas (5 min)
2. ✅ Add connection string to `.env.local` (1 min)
3. ✅ Run `npm run seed` and `npm run dev` (1 min)

**Total time: ~7 minutes to a fully functional backend!**

Let's go! 🚀
