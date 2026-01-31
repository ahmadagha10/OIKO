# Oiko Backend Setup Checklist

Follow these steps in order to get your backend running:

## ✅ Step 1: MongoDB Atlas Account Setup (5 minutes)

I've opened MongoDB Atlas in your browser. Now:

### 1.1 Create Account
- [ ] Sign up at https://www.mongodb.com/cloud/atlas/register
- [ ] Use Google/GitHub sign-in OR create with email
- [ ] Verify your email address

### 1.2 Create a Cluster
- [ ] Click "Build a Database"
- [ ] Select **M0 FREE** tier (it's free forever!)
- [ ] Choose provider: **AWS** (recommended)
- [ ] Choose region: **Middle East (Bahrain)** for Saudi Arabia
  - Or choose closest to your users
- [ ] Name your cluster: `oiko-cluster` (or any name)
- [ ] Click "Create Cluster" (takes 1-3 minutes)

### 1.3 Create Database User
- [ ] Go to "Database Access" in left sidebar
- [ ] Click "Add New Database User"
- [ ] Choose "Password" authentication
- [ ] Username: `oiko_admin` (or any name)
- [ ] Password: Click "Autogenerate Secure Password" and **SAVE IT**
- [ ] Set role: "Read and write to any database"
- [ ] Click "Add User"

### 1.4 Whitelist IP Address
- [ ] Go to "Network Access" in left sidebar
- [ ] Click "Add IP Address"
- [ ] Click "Allow Access from Anywhere" (0.0.0.0/0)
  - This is OK for development
  - For production, use specific IPs
- [ ] Click "Confirm"

### 1.5 Get Connection String
- [ ] Go to "Database" in left sidebar
- [ ] Click "Connect" button on your cluster
- [ ] Choose "Connect your application"
- [ ] Copy the connection string
- [ ] It looks like: `mongodb+srv://<username>:<password>@cluster.mongodb.net/`

---

## ✅ Step 2: Configure Your Project (1 minute)

### 2.1 Edit .env.local
```bash
# Open .env.local in your editor
code .env.local  # or nano .env.local
```

### 2.2 Add Your MongoDB URI
Replace this line:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/oiko?retryWrites=true&w=majority
```

With your actual connection string:
```env
MONGODB_URI=mongodb+srv://oiko_admin:YOUR_ACTUAL_PASSWORD@oiko-cluster.abc123.mongodb.net/oiko?retryWrites=true&w=majority
```

**Important:**
- Replace `<username>` with your database username (e.g., `oiko_admin`)
- Replace `<password>` with the password you saved
- Replace `<cluster>` with your cluster name
- Keep `oiko` as the database name

### 2.3 Save the File
- [ ] Save .env.local
- [ ] Do NOT commit .env.local to git (it's in .gitignore)

---

## ✅ Step 3: Seed Your Database (30 seconds)

Run this command to populate your database with products:

```bash
npm run seed
```

You should see:
```
✅ Connected to MongoDB
✅ Cleared existing products
✅ Seeded 7 products successfully!

📊 Product Summary:
  - hoodies: 2 products
  - tshirts: 2 products
  - hats: 1 products
  - socks: 1 products
  - totebags: 1 products
```

---

## ✅ Step 4: Start Your Server

```bash
npm run dev
```

Server starts at http://localhost:3000

---

## ✅ Step 5: Test Your API

### Test 1: Get All Products
```bash
curl http://localhost:3000/api/products
```

You should see JSON with your products!

### Test 2: Get Products by Category
```bash
curl http://localhost:3000/api/products?category=hoodies
```

### Test 3: Search Products
```bash
curl "http://localhost:3000/api/products?search=cozy"
```

### Test 4: Browse Your Site
Open http://localhost:3000 in your browser and:
- [ ] Browse products
- [ ] Add items to cart
- [ ] Go to checkout
- [ ] Fill out the form
- [ ] Complete payment

The order will now be saved to your MongoDB database!

---

## ✅ Step 6: Verify Order in Database

### Option A: MongoDB Atlas Web Interface
1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. You should see:
   - `products` collection (7 products)
   - `orders` collection (orders you created)

### Option B: API Call
```bash
# Get orders by email (replace with email you used)
curl "http://localhost:3000/api/orders?email=test@example.com"
```

---

## 🎉 Success Criteria

You're all set when:
- [x] MongoDB cluster is created and running
- [x] Database user is created
- [x] Connection string is in .env.local
- [x] `npm run seed` completed successfully
- [x] `npm run dev` starts without errors
- [x] `/api/products` returns product data
- [x] You can place an order through the website
- [x] Order appears in MongoDB Atlas

---

## 🆘 Troubleshooting

### "MongoServerError: bad auth"
- Your username or password is incorrect in .env.local
- Check MongoDB Atlas → Database Access for correct username
- Regenerate password if needed

### "Connection timeout"
- Check MongoDB Atlas → Network Access
- Make sure 0.0.0.0/0 is whitelisted
- Check your firewall/network

### "npm run seed" fails
- Make sure .env.local has correct MONGODB_URI
- Make sure cluster is active (not paused)
- Try running again - sometimes it times out on first try

### Can't see orders in database
- Check that checkout completed successfully
- Look for console errors in browser
- Check Network tab in browser DevTools for failed API calls

---

## 📞 Need Help?

Check:
1. BACKEND_SETUP.md for detailed instructions
2. MongoDB Atlas docs: https://docs.atlas.mongodb.com/
3. Console logs for error messages

---

## 🚀 What's Next?

Once your backend is working:
1. **Authentication** - Add user login/signup
2. **Payment Gateway** - Integrate Stripe or Telr
3. **Email Notifications** - Send order confirmations
4. **Admin Dashboard** - Manage products and orders
5. **Deploy** - Host on Vercel with production database

The frontend is already connected to your API! 🎉
