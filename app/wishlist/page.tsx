"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { useWishlist } from "@/contexts/wishlist-context";
import { type Product } from "@/lib/products";

export default function WishlistPage() {
  const { items: wishlistItems, isInitialized: wishlistIsInitialized } = useWishlist();
  const [displayItems, setDisplayItems] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize display items once on mount after context is initialized
  useEffect(() => {
    if (wishlistIsInitialized && !isLoaded) {
      setDisplayItems(wishlistItems);
      setIsLoaded(true);
    }
  }, [wishlistItems, wishlistIsInitialized, isLoaded]);

  return (
    <main className="bg-gradient-to-b from-muted/40 to-background">
      <div className="container mx-auto px-4 py-12 space-y-8">
        <section className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-primary">
              Wishlist
            </p>
            <h1 className="text-3xl font-bold md:text-4xl flex items-center gap-2">
              <Heart className="h-7 w-7 fill-primary text-primary" />
              Your wishlist
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Save your favorite items and come back to them later.
            </p>
          </div>
          <Badge variant="outline" className="w-fit">
            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
          </Badge>
        </section>

        {isLoaded && displayItems.length === 0 ? (
          <Card className="border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle>Your wishlist is empty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                You haven&apos;t added any items to your wishlist yet. Browse
                our collection and click the heart icon to save items you love.
              </p>
              <Button asChild>
                <a href="/products">Browse products</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
