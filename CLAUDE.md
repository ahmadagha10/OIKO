# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Build & Production
npm run build        # Create production build in .next/
npm start            # Run production server (after build)

# Database
npm run seed         # Seed MongoDB with product data

# Code Quality
npm run lint         # Run ESLint across codebase
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 16.1.1 with App Router
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Styling**: Tailwind CSS 4.x with CSS variables
- **UI Components**: shadcn/ui (New York style) + Radix UI primitives
- **State Management**: React Context API (no Redux/Zustand)
- **Animations**: Framer Motion (`motion` package)
- **Forms**: React Hook Form + Zod validation
- **File Uploads**: Cloudinary via next-cloudinary
- **Email**: Resend API with react-email templates
- **Analytics**: Vercel Analytics
- **Canvas Editing**: Konva.js via react-konva (for custom design editor)

### Project Structure

- **`app/`** - Next.js App Router pages and routes
  - Each route folder contains a `page.tsx` file
  - `layout.tsx` is the root layout with Header/Footer wrapping all pages
  - `globals.css` defines Tailwind base styles and CSS variables
  - Route structure: `/cart`, `/checkout`, `/customize`, `/products`, `/rewards`, `/account`, etc.

- **`components/`** - Shared React components
  - `ui/` - shadcn/ui components (60+ components including Button, Card, Dialog, etc.)
  - `emails/` - Email template components
  - Top-level files like `header.tsx`, `footer.tsx`, `landing-sections.tsx` are page-level components
  - `providers.tsx` wraps the app with all Context providers

- **`contexts/`** - React Context providers for global state
  - `auth-context.tsx` - User authentication state and methods
  - `cart-context.tsx` - Shopping cart state (persisted to localStorage)
  - `wishlist-context.tsx` - Wishlist state (persisted to localStorage)
  - `animation-context.tsx` - Animation state management

- **`lib/`** - Business logic and utilities
  - `products.ts` - Product data, categories, and helper functions (static data)
  - `rewards.ts` - Loyalty rewards/fragments point calculation logic
  - `auth.ts` - JWT token generation, verification, and auth middleware
  - `mongodb.ts` - MongoDB connection with caching for hot reloads
  - `api.ts` - Frontend API client functions for all backend endpoints
  - `cloudinary.ts` - Cloudinary configuration
  - `email.ts` - Email sending utilities with Resend
  - `form-validation.ts` - Zod schemas for form validation
  - `utils.ts` - Utility functions (cn helper for Tailwind classes)

- **`models/`** - Mongoose schemas and models
  - `Product.ts` - Product database model
  - `Order.ts` - Order database model
  - `User.ts` - User database model with authentication
  - `Design.ts` - Custom design saves
  - `RewardClaim.ts` - Reward redemption tracking
  - `TrialRequest.ts` - Product trial requests
  - `Subscriber.ts` - Newsletter subscribers

- **`types/`** - TypeScript type definitions
  - `products.ts` - Product interface with Arabic comments (legacy, differs from lib/products.ts)

- **`hooks/`** - Custom React hooks
  - `use-mobile.ts` - Responsive design hook
  - `use-outside-click.tsx` - Click outside detection

- **`public/`** - Static assets (images, icons, etc.)
  - `models/` - 3D model files (.glb) for product visualization

### Key Architectural Patterns

#### Context Providers Setup
The app uses a nested provider structure in `components/providers.tsx`:
```
AuthProvider > CartProvider > WishlistProvider > AnimationProvider > {children}
```

All providers are wrapped in the root layout (`app/layout.tsx`), making auth, cart, wishlist, and animation state available throughout the app. The `AuthProvider` is outermost so authentication state is available to all other contexts.

#### Product Data Model
There are THREE product data sources:
1. **`lib/products.ts`** - Static hardcoded product data (simple: id, name, price, description, image, category, colors[], sizes[]) - used for client-side filtering and basic UI
2. **`models/Product.ts`** - Mongoose database model - the source of truth for product data in production, seeded from lib/products.ts
3. **`types/products.ts`** - Legacy interface with Arabic comments (do not use)

**Important**: The app is in a hybrid state. Some pages use static data from `lib/products.ts`, while API routes use MongoDB. When adding features, prefer using the API routes (`/api/products`) over static data.

#### Rewards System
The app has a loyalty rewards system based on "fragment points":
- Hoodies = 18 points
- T-Shirts = 12 points
- Accessories (hats/socks/totebags) = 3 points
- Progress tracked in localStorage (`oiko_fragment_points`)
- Thresholds: 30 (cashback), 70 (discount), 100 (free item)
- Points are clamped at MAX_PROGRESS (100)

#### Cart System
- Cart items stored in localStorage with key `"cart"`
- Each cart item has: `id` (generated from product.id + size + color), `product`, `size`, `color`, `quantity`
- Cart context provides: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `getTotalItems`, `getTotalPrice`
- Fixed shipping cost: $25 (see `app/cart/page.tsx`)

#### shadcn/ui Configuration
- Style variant: "new-york"
- Uses CSS variables for theming (see `app/globals.css`)
- Import path alias: `@/components/ui/*`
- Additional registries configured: @magicui and @aceternity

#### Path Aliases
TypeScript paths configured with `@/*` pointing to root:
- `@/components/*` - Components
- `@/lib/*` - Utilities and business logic
- `@/contexts/*` - Context providers
- `@/hooks/*` - Custom hooks
- `@/types/*` - Type definitions

### Important Implementation Details

1. **Client Components**: Most components use `"use client"` directive due to:
   - Context consumption (cart, wishlist, animation)
   - localStorage usage
   - Interactive UI with state

2. **Font Configuration**: Uses Ubuntu font (weights: 300, 400, 500, 700) loaded via `next/font/google`

3. **Environment Variables**: Required variables in `.env.local`:
   - `MONGODB_URI` - MongoDB Atlas connection string
   - `JWT_SECRET` - Secret key for JWT token signing
   - `NEXT_PUBLIC_API_URL` - API base URL (http://localhost:3000 for dev)
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name for image uploads
   - `RESEND_API_KEY` - Resend API key for sending emails
   - `EMAIL_FROM` - Sender email address

   See `.env.example` for template.

4. **No Testing Framework**: No test setup currently exists. If adding tests, use Next.js conventions and document commands in package.json.

5. **Image Optimization**: Uses Next.js `<Image>` component with images in `/public/images/`

6. **Custom Canvas Editor**: The `/customize` route contains a large custom design editor (1843 lines) using Konva/react-konva for canvas manipulation, with Cloudinary upload integration

7. **Email Templates**: Email components exist in both `app/emails/` and `components/emails/` directories

8. **API Architecture**: Backend follows RESTful conventions with Next.js Route Handlers:
   - All API routes in `app/api/` directory
   - Authentication middleware in `lib/auth.ts` (requireAuth, requireAdmin)
   - Consistent response format: `{ success: boolean, data?: any, error?: string, message?: string }`
   - MongoDB connection caching prevents connection pool exhaustion during development

## Development Guidelines

### Adding New UI Components
Use shadcn/ui CLI to add components from the configured registries:
```bash
npx shadcn@latest add [component-name]
```

Components are added to `components/ui/` and use the New York style variant.

### Working with Products
- **Static data** is in `lib/products.ts` (used for seeding and fallback)
- **Database** stores products in MongoDB (models/Product.ts)
- To add products to database: Edit `lib/products.ts` and run `npm run seed`
- Categories: "hoodies", "tshirts", "hats", "socks", "totebags", "custom"
- The "accessories" category is a virtual category that groups hats, socks, and totebags
- **API Routes**:
  - `GET /api/products` - Get all products (query params: category, search, featured)
  - `GET /api/products/[id]` - Get single product by MongoDB ObjectId
  - `GET /api/products/filters` - Get available filter options
  - `GET /api/products/search` - Search products
  - `GET /api/products/suggestions` - Get search suggestions
  - `POST /api/admin/products/bulk` - Bulk create/update (admin only)
- Use helper functions from `lib/products.ts`: `getProductsByCategory(category)`, `getProductById(id)` for static data

### Working with Cart/Wishlist
- Always use context hooks: `useCart()`, `useWishlist()`
- Cart/wishlist automatically persist to localStorage
- Wait for `isInitialized` before rendering cart-dependent UI to avoid hydration mismatches

### Working with Rewards
- Import functions from `lib/rewards.ts`
- Use `getOrderFragmentPoints(items)` to calculate points for an order
- Use `getRewardTypeForProgress(points)` to determine reward tier
- Points are stored in localStorage with key `FRAGMENTS_KEY` ("oiko_fragment_points")
- Dispatch custom event `"oiko:points-updated"` when points change to sync across components

### Styling Approach
- Uses Tailwind CSS 4.x with `@tailwindcss/postcss`
- Theme colors defined as CSS variables in `app/globals.css`
- Use `cn()` utility from `lib/utils.ts` to merge Tailwind classes conditionally
- Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

### Working with Authentication
- **Context**: Use `useAuth()` hook from `contexts/auth-context.tsx`
- **API Functions**: Import from `lib/api.ts`: `signup()`, `login()`, `logout()`, `getCurrentUser()`, `updateProfile()`
- **Protected Routes**: Use `requireAuth()` or `requireAdmin()` middleware from `lib/auth.ts` in API routes
- **Token Storage**: JWT tokens stored in httpOnly cookies AND localStorage
- **Authentication Flow**:
  1. User signs up/logs in via API
  2. Backend returns JWT token and user data
  3. Frontend stores token and updates AuthContext
  4. Protected API routes verify token via Authorization header or cookie
- **Example Protected API Route**:
  ```typescript
  import { requireAuth } from '@/lib/auth';

  export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult; // 401 if not authenticated
    const user = authResult as IUser;
    // ... your logic with authenticated user
  }
  ```

### API Routes Structure
All API routes follow REST conventions and return consistent JSON format:

**Authentication** (`/api/auth/*`)
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (clears cookie)
- `GET /api/auth/me` - Get current user (protected)
- `PATCH /api/auth/me` - Update user profile (protected)

**Products** (`/api/products/*`)
- `GET /api/products` - List all products (query: category, search, featured)
- `GET /api/products/[id]` - Get single product
- `GET /api/products/filters` - Get filter options
- `GET /api/products/search` - Search products
- `GET /api/products/suggestions` - Get search suggestions
- Admin routes in `/api/admin/products/*`

**Orders** (`/api/orders/*`)
- `GET /api/orders` - Get user orders (protected, query: email, orderRef)
- `POST /api/orders` - Create new order
- Admin routes in `/api/admin/orders/*`

**Addresses** (`/api/addresses/*`)
- `GET /api/addresses` - Get user addresses (protected)
- `POST /api/addresses` - Add new address (protected)
- `PATCH /api/addresses/[id]` - Update address (protected)
- `DELETE /api/addresses/[id]` - Delete address (protected)
- `POST /api/addresses/[id]/set-default` - Set default address (protected)

**Rewards** (`/api/rewards/*`)
- `GET /api/rewards/history` - Get reward claim history (protected)
- `POST /api/rewards/claim` - Claim reward (protected)

**Designs** (`/api/designs/*`)
- `GET /api/designs` - Get user's saved designs (protected)
- `POST /api/designs` - Save new design (protected)
- `GET /api/designs/[id]` - Get single design (protected)
- `PATCH /api/designs/[id]` - Update design (protected)
- `DELETE /api/designs/[id]` - Delete design (protected)

**Admin** (`/api/admin/*`) - All require admin authentication
- `/api/admin/users` - User management
- `/api/admin/orders` - Order management
- `/api/admin/products/bulk` - Bulk product operations
- `/api/admin/analytics/*` - Analytics endpoints

### Database Models
**User Model** (`models/User.ts`)
- Fields: email, password (hashed), firstName, lastName, phone, role, fragmentPoints, addresses[]
- Methods: comparePassword()
- Middleware: Password hashing pre-save

**Product Model** (`models/Product.ts`)
- Fields: name, price, description, image, category, colors[], sizes[], stock, featured
- Indexed: category, featured

**Order Model** (`models/Order.ts`)
- Fields: orderRef (unique), customerInfo, items[], subtotal, shipping, total, pointsEarned, status, paymentStatus, userId
- Statuses: pending, processing, shipped, delivered, cancelled

**Design Model** (`models/Design.ts`)
- Fields: userId, productType, designData, previewImage, status
- Used for saving custom designs from `/customize` page

### Code Style
- Functional components with hooks (no class components)
- TypeScript strict mode enabled
- Component naming: PascalCase
- Hook naming: `useSomething`
- Utility functions: camelCase
- Follow existing indentation and formatting (no Prettier config)

### Setup Instructions
1. **Install dependencies**: `npm install`
2. **Configure environment**: Copy `.env.example` to `.env.local` and fill in values
3. **Setup MongoDB Atlas**: See `BACKEND_SETUP.md` for detailed instructions
4. **Seed database**: Run `npm run seed` to populate products
5. **Start development**: Run `npm run dev`

For detailed backend setup, authentication setup, and email configuration, see:
- `BACKEND_SETUP.md` - MongoDB Atlas setup and API testing
- `AUTH_SETUP.md` - Authentication system documentation
- `EMAIL_SETUP.md` - Email service configuration
