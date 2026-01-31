"use client";

import { SetStateAction, useState } from "react";
import { use } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, Heart, Share2, Minus, Plus, Link as LinkIcon, Check } from "lucide-react";
import { getProductById } from "@/lib/products";
import { getProductFragmentPoints } from "@/lib/rewards";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useAnimation } from "@/contexts/animation-context";
import { toast } from "sonner";
import { useRef } from "react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const product = getProductById(Number(slug));
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { triggerFlyTo } = useAnimation();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  const cartBtnRef = useRef<HTMLButtonElement>(null);
  const wishlistBtnRef = useRef<HTMLButtonElement>(null);

  if (!product) {
    notFound();
  }
  const productPoints = getProductFragmentPoints(product);

  const handleAddToCart = async () => {
    // Validate required options if product has sizes or colors
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    setIsAddingToCart(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    addToCart(product, {
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      quantity,
    });

    triggerFlyTo('cart', cartBtnRef, 'header-cart-btn', product.image);
    toast.success(`${quantity} ${product.name}${selectedSize ? ` (${selectedSize})` : ""}${selectedColor ? ` - ${selectedColor}` : ""} added to cart!`);

    // Reset quantity after adding
    setQuantity(1);
    setIsAddingToCart(false);
  };

  const handleWishlistToggle = async () => {
    if (!product) return;

    setIsTogglingWishlist(true);
    const adding = !isInWishlist(product.id);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    toggleWishlist(product);

    if (adding) {
      triggerFlyTo('wishlist', wishlistBtnRef, 'header-wishlist-btn');
      toast.success(`${product.name} added to wishlist!`);
    } else {
      toast.success(`${product.name} removed from wishlist!`);
    }

    setIsTogglingWishlist(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${product.name}!`);

    const shareUrls: { [key: string]: string } = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct link sharing via URL, but we can link to the site.
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <>
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground text-balance">
                {product.name}
              </h1>
              <p className="text-base text-foreground/70">Made to belong.</p>
            </div>
            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-3xl font-bold text-foreground">
                {product.price}
              </span>
              <span className="text-base font-medium text-muted-foreground">
                SAR
              </span>
            </div>

            <div className="space-y-2 pt-1 sm:space-y-3 sm:pt-2">
              {/* Desktop Description */}
              <div className="hidden md:block space-y-1">
                <p className="text-foreground/80 leading-relaxed">
                  This piece is made to feel familiar from the first wear.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  Designed to stay with you, quietly.
                </p>
              </div>

              {/* Mobile Description */}
              <div className="md:hidden space-y-1">
                <p className="text-foreground/80 leading-relaxed">
                  Designed to feel familiar from the first wear.
                </p>
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Select Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size: string) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        onClick={() => setSelectedSize(size)}
                        className="min-w-[60px]"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Select Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color: string) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? "default" : "outline"}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-1 sm:space-y-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Quantity
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <p className="text-sm text-foreground/60 text-center">
                  Belonging, worn daily.
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    ref={cartBtnRef}
                    size="lg"
                    className="flex-1 bg-foreground text-background"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                  </Button>
                  <Button
                    ref={wishlistBtnRef}
                    size="icon"
                    variant="outline"
                    onClick={handleWishlistToggle}
                    disabled={isTogglingWishlist}
                    className={isInWishlist(product.id) ? "text-red-500 border-red-500" : ""}
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={handleCopyLink}>
                        {copied ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Copy Link
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.570-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('instagram')}>
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                        >
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                        Instagram
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('facebook')}>
                        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('twitter')}>
                        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        Twitter
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Desktop - Product Philosophy & Details */}
              <div className="hidden md:block mt-10 space-y-6 text-sm">
                <div className="space-y-2">
                  <p className="text-foreground/80 leading-relaxed">
                    OIKO pieces are shaped around belonging.
                  </p>
                  <p className="text-foreground/80 leading-relaxed">
                    They are made to be lived in, not replaced.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-foreground/70 uppercase tracking-wide">Details</p>
                  <ul className="space-y-1 text-sm text-muted-foreground/80">
                    <li>Heavyweight cotton fabric</li>
                    <li>Soft interior, built for daily wear</li>
                    <li>Relaxed fit</li>
                    <li>Made to age with use</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-foreground/70 uppercase tracking-wide">Fit</p>
                  <p className="text-sm text-muted-foreground/80">
                    Designed for comfort without effort.
                  </p>
                  <p className="text-sm text-muted-foreground/80">
                    Choose your usual size.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-foreground/70 uppercase tracking-wide">Care</p>
                  <ul className="space-y-1 text-sm text-muted-foreground/80">
                    <li>Machine wash cold</li>
                    <li>Wash inside out</li>
                    <li>Do not tumble dry</li>
                  </ul>
                </div>
              </div>

              {/* Mobile - Condensed Details */}
              <div className="md:hidden mt-8 space-y-6 text-sm">
                <div className="space-y-1">
                  <p className="text-foreground/80 leading-relaxed">
                    Made to be lived in.
                  </p>
                  <p className="text-foreground/80 leading-relaxed">
                    Designed to stay.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-foreground/70 uppercase tracking-wide">Details</p>
                  <ul className="space-y-1 text-sm text-muted-foreground/80">
                    <li>Heavyweight cotton</li>
                    <li>Soft interior</li>
                    <li>Relaxed fit</li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-foreground/70 uppercase tracking-wide">Fit</p>
                  <p className="text-sm text-muted-foreground/80">
                    True to size. Comfortable by design.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-foreground/70 uppercase tracking-wide">Care</p>
                  <ul className="space-y-1 text-sm text-muted-foreground/80">
                    <li>Machine wash cold</li>
                    <li>Wash inside out</li>
                    <li>Do not tumble dry</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
