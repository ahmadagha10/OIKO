"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useAnimation } from "@/contexts/animation-context";
import { toast } from "sonner";
import { useRef } from "react";

interface ProductCardProps {
  product: Product;
  productLink?: string;
}

export function ProductCard({ product, productLink }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { triggerFlyTo } = useAnimation();
  const wishlistBtnRef = useRef<HTMLButtonElement>(null);

  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const adding = !isWishlisted;
    toggleWishlist(product);

    if (adding) {
      triggerFlyTo('wishlist', wishlistBtnRef, 'header-wishlist-btn');
      toast.success(`${product.name} added to wishlist!`);
    } else {
      toast.success(`${product.name} removed from wishlist!`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If product has required options (sizes/colors), navigate to product page
    // Otherwise, add directly to cart
    if (product.sizes && product.sizes.length > 0) {
      window.location.href = productLink || `/products/${product.id}`;
      return;
    }

    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link
      href={productLink || `/products/${product.id}`}
      className="relative overflow-hidden rounded-lg bg-card border border-border transition-shadow"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg?height=600&width=400";
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-foreground truncate">
          {product.name}
        </h3>

        <p className="flex items-baseline gap-2 text-sm text-muted-foreground">
          <span className="font-bold text-foreground/90">{product.price}</span>
          <span className="font-bold text-foreground/90">SAR</span>
        </p>

        {/* Size/Color Info */}
        {(product.sizes || product.colors) && (
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground/70 pt-1">
            {product.sizes && product.sizes.length > 0 && (
              <span>{product.sizes.length} sizes</span>
            )}
            {product.sizes && product.colors && <span>•</span>}
            {product.colors && product.colors.length > 0 && (
              <span>{product.colors.length} colors</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <Button
            ref={wishlistBtnRef}
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={handleWishlistToggle}
            type="button"
            aria-label="Add to wishlist"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={handleAddToCart}
            type="button"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
