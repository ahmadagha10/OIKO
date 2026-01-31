"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import { AnimationProvider } from "@/contexts/animation-context";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <AnimationProvider>
            {children}
            <Toaster />
          </AnimationProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
