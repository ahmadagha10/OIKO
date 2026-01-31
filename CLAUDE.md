# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Build & Production
npm run build        # Create production build in .next/
npm start            # Run production server (after build)

# Code Quality
npm run lint         # Run ESLint across codebase
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 16.1.1 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4.x with CSS variables
- **UI Components**: shadcn/ui (New York style) + Radix UI primitives
- **State Management**: React Context API (no Redux/Zustand)
- **Animations**: Framer Motion (`motion` package)
- **Forms**: React Hook Form + Zod validation
- **Analytics**: Vercel Analytics

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
  - `cart-context.tsx` - Shopping cart state (persisted to localStorage)
  - `wishlist-context.tsx` - Wishlist state (persisted to localStorage)
  - `animation-context.tsx` - Animation state management

- **`lib/`** - Business logic and utilities
  - `products.ts` - Product data, categories, and helper functions
  - `rewards.ts` - Loyalty rewards/fragments point calculation logic
  - `utils.ts` - Utility functions (cn helper for Tailwind classes)

- **`types/`** - TypeScript type definitions
  - `products.ts` - Product interface with Arabic comments (legacy, differs from lib/products.ts)

- **`hooks/`** - Custom React hooks
  - `use-mobile.ts` - Responsive design hook
  - `use-outside-click.tsx` - Click outside detection

- **`public/`** - Static assets (images, icons, etc.)

### Key Architectural Patterns

#### Context Providers Setup
The app uses a nested provider structure in `components/providers.tsx`:
```
CartProvider > WishlistProvider > AnimationProvider > {children}
```

All providers are wrapped in the root layout (`app/layout.tsx`), making cart, wishlist, and animation state available throughout the app.

#### Product Data Model
There are TWO different Product interfaces:
1. **`lib/products.ts`** - Active model used in the app (simple: id, name, price, description, image, category, colors[], sizes[])
2. **`types/products.ts`** - Legacy model with Arabic comments (includes slug, images[], originalPrice, inStock, featured)

Always use the model from `lib/products.ts` for new features.

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

3. **No Environment Variables**: Currently no `.env` files in the repo. If adding env vars, create `.env.example` and document in README.

4. **No Testing Framework**: No test setup currently exists. If adding tests, use Next.js conventions and document commands in package.json.

5. **Image Optimization**: Uses Next.js `<Image>` component with images in `/public/images/`

6. **Custom Canvas Editor**: The `/customize` route contains a large custom design editor (56KB `page.tsx`) using Konva/react-konva for canvas manipulation

7. **Email Templates**: Email components exist in both `app/emails/` and `components/emails/` directories

## Development Guidelines

### Adding New UI Components
Use shadcn/ui CLI to add components from the configured registries:
```bash
npx shadcn@latest add [component-name]
```

Components are added to `components/ui/` and use the New York style variant.

### Working with Products
- Product data is hardcoded in `lib/products.ts` (not a database)
- To add products, edit the `products` array
- Categories: "hoodies", "tshirts", "hats", "socks", "totebags"
- The "accessories" category is a virtual category that groups hats, socks, and totebags
- Use helper functions: `getProductsByCategory(category)`, `getProductById(id)`

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

### Code Style
- Functional components with hooks (no class components)
- TypeScript strict mode enabled
- Component naming: PascalCase
- Hook naming: `useSomething`
- Utility functions: camelCase
- Follow existing indentation and formatting (no Prettier config)
