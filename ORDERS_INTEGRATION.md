# Orders Database Integration

✅ Orders are now fully integrated with MongoDB! This document explains how the orders system works.

## Overview

Orders are stored in MongoDB and linked to user accounts. Both authenticated users and guests can place orders, and users can view their order history in the account page.

## How It Works

### 1. Placing an Order (Checkout Flow)

When a customer completes checkout:

1. **Order Data Collection**: Customer info, cart items, shipping, and total are collected
2. **User Linking** (if logged in): Order is linked to the user's account via `userId`
3. **Order Creation**: Order is saved to MongoDB via `/api/orders` endpoint
4. **Email Notification**: Order confirmation email is sent automatically
5. **Points Calculation**: Fragment points are calculated and awarded
6. **Database Storage**: Order is persisted with status "pending"

**File**: `/app/checkout/page.tsx`

```typescript
const orderData = {
  orderRef: "WR-123456",
  customerInfo: { /* customer details */ },
  items: [ /* cart items */ ],
  subtotal: 250,
  shipping: 25,
  total: 275,
  pointsEarned: 18,
  status: "pending",
  paymentStatus: "paid",
  userId: authUser?._id // Links to user if logged in
};

await createOrder(orderData);
```

### 2. Viewing Orders (Account Page)

Users can view their order history in the account page:

1. **Orders Fetched**: Orders are loaded from MongoDB by user email
2. **Real-time Data**: All order data comes from the database
3. **Order Details**: Shows items, status, tracking, and points earned

**File**: `/app/account/page.tsx`

```typescript
const response = await getOrders({ email: userEmail });
setOrders(response.data);
```

### 3. Order Statuses

Orders have two status fields:

**Order Status**:
- `pending` - Order placed, awaiting processing
- `processing` - Order being prepared
- `shipped` - Order shipped, in transit
- `delivered` - Order delivered to customer
- `cancelled` - Order cancelled

**Payment Status**:
- `pending` - Payment not confirmed
- `paid` - Payment confirmed
- `failed` - Payment failed
- `refunded` - Payment refunded

## Database Schema

### Order Model (`/models/Order.ts`)

```typescript
{
  orderRef: String,         // Unique order reference (WR-123456)
  customerInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    zipCode: String,
    latitude: Number,
    longitude: Number
  },
  items: [{
    productId: String,      // Product ID (supports both DB and hardcoded IDs)
    productName: String,
    productImage: String,
    price: Number,
    quantity: Number,
    size: String,
    color: String
  }],
  subtotal: Number,
  shipping: Number,
  total: Number,
  pointsEarned: Number,
  status: String,           // pending | processing | shipped | delivered | cancelled
  paymentStatus: String,    // pending | paid | failed | refunded
  userId: ObjectId,         // Links to User (optional for guest orders)
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Create Order
```
POST /api/orders
```

Creates a new order in the database.

**Request Body**:
```json
{
  "orderRef": "WR-123456",
  "customerInfo": { /* ... */ },
  "items": [ /* ... */ ],
  "subtotal": 250,
  "shipping": 25,
  "total": 275,
  "pointsEarned": 18,
  "status": "pending",
  "paymentStatus": "paid",
  "userId": "optional-user-id"
}
```

**Response**:
```json
{
  "success": true,
  "data": { /* order object */ },
  "message": "Order created successfully"
}
```

### Get Orders
```
GET /api/orders?email=user@example.com
```

Retrieves orders by customer email.

**Query Parameters**:
- `email` - Filter by customer email
- `orderRef` - Filter by order reference

**Response**:
```json
{
  "success": true,
  "count": 5,
  "data": [ /* array of orders */ ]
}
```

### Get Single Order
```
GET /api/orders/[id]
```

Retrieves a specific order by ID.

## Features

### ✅ For Customers

1. **Order Placement**: Place orders with complete details
2. **Order History**: View all past orders in account page
3. **Order Details**: See items, pricing, status, and tracking
4. **Email Notifications**: Receive confirmation emails
5. **Points Tracking**: See fragment points earned per order
6. **Guest Orders**: Place orders without account (tracked by email)

### ✅ For Logged-in Users

- Orders linked to account via `userId`
- Order history synced across devices
- Profile data pre-filled at checkout
- Points automatically added to account

### ✅ For Guest Users

- Orders tracked by email
- Can view orders by entering email
- Can create account later to link orders

## Data Flow

```
Checkout Page
    ↓
Create Order API (/api/orders)
    ↓
MongoDB (orders collection)
    ↓
Email Service (Order Confirmation)
    ↓
Account Page (Order History)
```

## Testing

### 1. Test Order Creation

1. Add items to cart
2. Go to `/checkout`
3. Fill in customer details
4. Submit order
5. Check MongoDB database for new order
6. Check email for confirmation

### 2. Test Order Retrieval

1. Log in to account
2. Go to `/account`
3. View "Orders" tab
4. Verify orders display from database

### 3. Test Guest Orders

1. Place order without logging in
2. Note the email used
3. Check database for order with that email
4. Verify order appears when logged in with that email

## Database Queries

### View All Orders
```javascript
db.orders.find().sort({ createdAt: -1 })
```

### View User's Orders
```javascript
db.orders.find({
  userId: ObjectId("user-id")
}).sort({ createdAt: -1 })
```

### View Orders by Email
```javascript
db.orders.find({
  "customerInfo.email": "user@example.com"
}).sort({ createdAt: -1 })
```

### View Pending Orders
```javascript
db.orders.find({
  status: "pending"
}).sort({ createdAt: -1 })
```

## Future Enhancements

- [ ] Admin dashboard to manage orders
- [ ] Order status update emails
- [ ] Tracking number integration
- [ ] Invoice generation (PDF)
- [ ] Order cancellation by customer
- [ ] Refund processing
- [ ] Advanced order filtering
- [ ] Order export (CSV/Excel)

## Troubleshooting

### Orders Not Showing in Account

1. Check if user email matches order email
2. Verify MongoDB connection
3. Check browser console for API errors
4. Verify `/api/orders` endpoint is working

### Order Creation Fails

1. Check MongoDB connection
2. Verify all required fields are provided
3. Check server logs for errors
4. Ensure product IDs are strings

### Email Not Sent

1. Check `RESEND_API_KEY` is configured
2. Verify email address is valid
3. Check server logs for email errors
4. Note: Emails won't send if Resend is not configured

## Related Files

- `/app/checkout/page.tsx` - Checkout flow
- `/app/account/page.tsx` - Order history
- `/app/api/orders/route.ts` - Orders API
- `/models/Order.ts` - Order schema
- `/lib/api.ts` - API client functions
- `/lib/email.ts` - Email sending functions
