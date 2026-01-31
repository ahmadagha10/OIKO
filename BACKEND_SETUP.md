# Backend Setup Guide

This guide will help you set up the MongoDB Atlas database and backend API for Oiko.

## 1. MongoDB Atlas Setup

### Create a MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Verify your email address

### Create a Cluster
1. Click "Build a Database"
2. Choose **M0 FREE** tier
3. Select your cloud provider (AWS recommended)
4. Choose a region close to your users (Middle East - Bahrain for Saudi Arabia)
5. Name your cluster (e.g., `oiko-cluster`)
6. Click "Create Cluster"

### Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password (**Save these!**)
5. Set "Built-in Role" to "Read and write to any database"
6. Click "Add User"

### Whitelist IP Address
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your specific IP addresses
5. Click "Confirm"

### Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://<username>:<password>@...`)

## 2. Configure Environment Variables

1. Open `.env.local` in your project root
2. Replace the `MONGODB_URI` with your actual connection string:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/oiko?retryWrites=true&w=majority
```

**Important:**
- Replace `<username>` with your database username
- Replace `<password>` with your database password
- Replace `<your-cluster>` with your cluster name
- Keep `oiko` as the database name

## 3. Seed the Database

Run this command to populate your database with initial product data:

```bash
npm run seed
```

You should see output like:
```
✅ Connected to MongoDB
✅ Cleared existing products
✅ Seeded 7 products successfully!
```

## 4. Test the API

Start your development server:

```bash
npm run dev
```

Test the API endpoints:

### Get All Products
```bash
curl http://localhost:3000/api/products
```

### Get Products by Category
```bash
curl http://localhost:3000/api/products?category=hoodies
```

### Get Single Product (replace ID with actual MongoDB ObjectId)
```bash
curl http://localhost:3000/api/products/YOUR_PRODUCT_ID
```

### Create an Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderRef": "WR-123456",
    "customerInfo": {
      "firstName": "Ahmad",
      "lastName": "Test",
      "email": "test@example.com",
      "phone": "+966501234567",
      "address": "Riyadh, Saudi Arabia",
      "zipCode": "12345"
    },
    "items": [
      {
        "productId": "YOUR_PRODUCT_ID",
        "productName": "Cozy Hoodie",
        "productImage": "/images/collections/cozyguyhoodie.png",
        "price": 199,
        "quantity": 1,
        "size": "M",
        "color": "black"
      }
    ],
    "subtotal": 199,
    "shipping": 25,
    "total": 224,
    "pointsEarned": 18
  }'
```

## 5. API Endpoints Reference

### Products
- `GET /api/products` - Get all products
  - Query params: `?category=hoodies`, `?featured=true`, `?search=cozy`
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Orders
- `GET /api/orders` - Get orders
  - Query params: `?email=user@example.com`, `?orderRef=WR-123456`
- `GET /api/orders/[id]` - Get single order
- `POST /api/orders` - Create order
- `PATCH /api/orders/[id]` - Update order status (admin)

## 6. Database Models

### Product
```typescript
{
  name: string
  price: number
  description: string
  image: string
  category: 'hoodies' | 'tshirts' | 'hats' | 'socks' | 'totebags' | 'custom'
  colors?: string[]
  sizes?: string[]
  stock?: number
  featured?: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Order
```typescript
{
  orderRef: string (unique)
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    zipCode: string
    latitude?: number
    longitude?: number
  }
  items: [
    {
      productId: ObjectId
      productName: string
      productImage: string
      price: number
      quantity: number
      size?: string
      color?: string
    }
  ]
  subtotal: number
  shipping: number
  total: number
  pointsEarned: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod?: string
  userId?: ObjectId
  createdAt: Date
  updatedAt: Date
}
```

### User
```typescript
{
  email: string (unique)
  password: string (hashed)
  firstName: string
  lastName: string
  phone?: string
  fragmentPoints: number
  addresses: [
    {
      address: string
      zipCode: string
      latitude?: number
      longitude?: number
      isDefault: boolean
    }
  ]
  createdAt: Date
  updatedAt: Date
}
```

## 7. Next Steps

- [ ] Set up authentication (JWT or NextAuth.js)
- [ ] Add payment gateway (Stripe/Telr)
- [ ] Implement email notifications
- [ ] Add admin dashboard
- [ ] Deploy to production

## Troubleshooting

### Connection Error
- Verify your IP is whitelisted in MongoDB Atlas
- Check username and password in connection string
- Ensure network allows MongoDB Atlas connection

### Seed Script Fails
- Make sure `.env.local` has correct `MONGODB_URI`
- Check MongoDB Atlas user has read/write permissions
- Verify cluster is running and accessible

### API Returns 500 Error
- Check server logs in terminal
- Verify MongoDB connection is established
- Check if models are properly imported

For more help, check the [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/).
