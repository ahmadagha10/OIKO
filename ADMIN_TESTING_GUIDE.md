# Admin Dashboard Testing Guide

## Quick Start

### 1. Create Admin User

If you haven't already created an admin user, run:

```bash
npm run create-test-user
```

This will create two users:
- **Admin User**: admin@oiko.com / admin123
- **Test User**: test@oiko.com / password123

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

### 3. Login as Admin

1. Navigate to http://localhost:3000/login
2. Enter credentials:
   - Email: `admin@oiko.com`
   - Password: `admin123`
3. Click "Login"

### 4. Access Admin Dashboard

After logging in, navigate to http://localhost:3000/admin

You should see the admin dashboard with sidebar navigation.

## Testing Each Feature

### Dashboard Overview
**URL**: `/admin`

**Test**:
- ✅ Check that 4 stat cards display (Revenue, Orders, Users, Products)
- ✅ Verify recent orders table shows latest orders
- ✅ Click on an order row - should navigate to order details
- ✅ Click "View All" button - should navigate to orders page

### Orders Management
**URL**: `/admin/orders`

**Test**:
- ✅ Verify orders table loads with pagination
- ✅ Test search - enter customer email or order ref
- ✅ Test status filter - select different statuses
- ✅ Test payment filter - select different payment statuses
- ✅ Test items per page - change from 25 to 10 or 50
- ✅ Click "..." menu on an order row
- ✅ Select "Mark as Processing" - verify status updates
- ✅ Select "Mark as Shipped" - verify status updates
- ✅ Select "Mark as Delivered" - verify status updates
- ✅ Verify toast notification appears on success
- ✅ Test pagination - click Next/Previous buttons

### Users Management
**URL**: `/admin/users`

**Test**:
- ✅ Verify users table loads with pagination
- ✅ Test search - enter user name or email
- ✅ Test role filter - select Customer or Admin
- ✅ Verify user avatars show initials
- ✅ Click "..." menu on a user row
- ✅ Select "View Profile" - should navigate to user profile
- ✅ Select "View Orders" - should show user's orders
- ✅ Select "Delete User" - confirmation dialog should appear
- ✅ Test delete confirmation - click Cancel (should close)
- ✅ Test delete confirmation - click Delete (should delete user)
- ✅ Verify toast notification appears on success

### Products Management
**URL**: `/admin/products`

**Test**:
- ✅ Verify products table loads with product images
- ✅ Test search - enter product name
- ✅ Test category filter - select different categories
- ✅ Click checkbox on a product row - bulk operations bar should appear
- ✅ Select multiple products - count should update
- ✅ Click "Mark Featured" in bulk bar - verify products become featured
- ✅ Click "Delete" in bulk bar - verify products are deleted
- ✅ Click "Clear" in bulk bar - selections should clear
- ✅ Click "..." menu on a product row
- ✅ Select "View Product" - should navigate to product page
- ✅ Select "Mark as Featured" / "Remove from Featured" - star should toggle
- ✅ Select "Delete Product" - confirmation dialog should appear
- ✅ Verify toast notifications appear on success

### Analytics Dashboard
**URL**: `/admin/analytics`

**Test**:
- ✅ Verify period selector defaults to "Last 30 days"
- ✅ Change period - verify data updates
- ✅ Click "Sales" tab:
  - ✅ Verify 4 stat cards display
  - ✅ Verify "Revenue Over Time" line chart renders
  - ✅ Verify "Orders Over Time" bar chart renders
  - ✅ Verify "Revenue by Category" pie chart renders
  - ✅ Verify "Top Products by Revenue" table displays
- ✅ Click "Customers" tab:
  - ✅ Verify 4 stat cards display
  - ✅ Verify "New Customers Over Time" line chart renders
  - ✅ Verify "Top Customers by Spending" table displays
- ✅ Click "Products" tab:
  - ✅ Verify 4 stat cards display
  - ✅ Verify "Sales by Category" bar chart renders
  - ✅ Verify "Top Selling Products" table displays
  - ✅ Verify "Low Stock Alert" table displays

### Navigation & Layout

**Test**:
- ✅ Click sidebar menu items - verify active state highlights
- ✅ Click "Back to Site" button - should return to home page
- ✅ On mobile (resize browser):
  - ✅ Verify sidebar collapses
  - ✅ Click hamburger menu - sidebar should open as sheet
  - ✅ Tables should scroll horizontally
  - ✅ Stats cards should stack vertically
- ✅ Verify sticky header with sidebar trigger

### Authentication & Authorization

**Test**:
- ✅ Logout and login as regular user (test@oiko.com / password123)
- ✅ Try to access /admin - should redirect to login
- ✅ Login as admin again - should access admin dashboard
- ✅ Verify JWT token is sent with all API requests

### Error Handling

**Test**:
- ✅ Disconnect internet - verify error toast appears
- ✅ Verify empty states display when no data matches filters
- ✅ Clear search that has no results - verify empty state
- ✅ Verify loading skeletons appear during data fetch
- ✅ Test with invalid data - verify error messages

## Expected API Endpoints

The admin dashboard uses these API endpoints (should already exist):

### Orders
- `GET /api/admin/orders` - List orders with pagination
- `PATCH /api/admin/orders/:id` - Update order status

### Users
- `GET /api/admin/users` - List users with pagination
- `DELETE /api/admin/users/:id` - Delete user

### Products
- `GET /api/products` - List products
- `POST /api/admin/products/bulk` - Bulk product operations

### Analytics
- `GET /api/admin/analytics/sales` - Sales analytics
- `GET /api/admin/analytics/customers` - Customer analytics
- `GET /api/admin/analytics/products` - Product analytics

## Common Issues & Solutions

### Issue: "Authentication failed" on admin pages
**Solution**: Make sure you're logged in as an admin user (admin@oiko.com). Regular users cannot access admin pages.

### Issue: Charts not rendering
**Solution**: Check browser console for errors. Recharts requires valid data structure. If no data exists, charts may be empty.

### Issue: Pagination not working
**Solution**: Verify API returns pagination metadata in response. Check network tab in browser DevTools.

### Issue: Bulk operations not working
**Solution**: Ensure at least one product is selected. Check that the bulk API endpoint `/api/admin/products/bulk` is working.

### Issue: Stats cards showing 0
**Solution**: Seed the database with products and create some test orders first.

### Issue: TypeScript errors
**Solution**: Run `npx tsc --noEmit` to check for type errors. All admin pages should compile without errors.

## Seeding Test Data

To populate the database with test data:

```bash
# Seed products
npm run seed

# Create test users (includes admin)
npm run create-test-user
```

Then manually create some test orders by:
1. Login as test user
2. Add items to cart
3. Complete checkout
4. Repeat 3-5 times to have multiple orders

This will give you data to view in the admin dashboard.

## Browser DevTools Checklist

When testing, keep DevTools open and check:

1. **Console Tab**: No errors should appear
2. **Network Tab**:
   - All API requests should return 200 status
   - Verify Authorization header is present
   - Check response data structure matches expected format
3. **Application Tab**:
   - Verify JWT token is stored in localStorage
   - Check user data in localStorage

## Success Criteria

The admin dashboard is working correctly if:

- ✅ All pages load without TypeScript errors
- ✅ All pages load without runtime errors in console
- ✅ Non-admin users are redirected to login
- ✅ Admin users can access all features
- ✅ All CRUD operations work (Create, Read, Update, Delete)
- ✅ All filters and search work correctly
- ✅ All charts render with data
- ✅ All toast notifications appear on actions
- ✅ All confirmation dialogs work
- ✅ Mobile responsive design works
- ✅ Loading states appear during data fetch
- ✅ Empty states appear when no data

## Performance Testing

Optional performance checks:

- ✅ Dashboard loads in < 2 seconds
- ✅ Table pagination is smooth
- ✅ Search is debounced (doesn't search on every keystroke)
- ✅ Charts render smoothly without lag
- ✅ Bulk operations complete in reasonable time

## Accessibility Testing

Optional accessibility checks:

- ✅ All interactive elements are keyboard accessible
- ✅ Tab navigation works through all controls
- ✅ Screen reader can read all content
- ✅ Color contrast meets WCAG standards
- ✅ Focus indicators are visible

## Next Steps After Testing

Once testing is complete:

1. Fix any bugs found
2. Add any missing features from the plan
3. Optimize performance if needed
4. Consider adding the optional enhancements listed in ADMIN_DASHBOARD_SUMMARY.md
5. Deploy to production

## Support

If you encounter issues not covered in this guide:

1. Check the ADMIN_DASHBOARD_SUMMARY.md for implementation details
2. Review the plan in the conversation transcript
3. Check the existing codebase patterns in `/app/account` for similar functionality
4. Review the API routes in `/app/api/admin/` to verify they match expectations
