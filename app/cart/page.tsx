"use client";

import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import Image from "next/image";
import Link from "next/link";
import { clampProgress, FRAGMENTS_KEY, getOrderFragmentPoints, MAX_PROGRESS } from "@/lib/rewards";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart();
  const shippingAmount = 25;
  const [currentPoints, setCurrentPoints] = useState<number | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const orderPoints = useMemo(() => getOrderFragmentPoints(items), [items]);

  useEffect(() => {
    const syncPoints = () => {
      const storedValue = localStorage.getItem(FRAGMENTS_KEY);
      if (storedValue === null) {
        setCurrentPoints(null);
        return;
      }
      const storedPoints = Number(storedValue);
      if (Number.isNaN(storedPoints)) {
        setCurrentPoints(null);
        return;
      }
      setCurrentPoints(clampProgress(storedPoints));
    };

    syncPoints();
    window.addEventListener("oiko:points-updated", syncPoints);
    return () => window.removeEventListener("oiko:points-updated", syncPoints);
  }, []);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    setUpdatingItemId(itemId);
    await new Promise((resolve) => setTimeout(resolve, 300));
    updateQuantity(itemId, newQuantity);
    setUpdatingItemId(null);
  };

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItemId(itemId);
    await new Promise((resolve) => setTimeout(resolve, 300));
    removeFromCart(itemId);
    setRemovingItemId(null);
  };

  return (
    <main className="bg-gradient-to-b from-muted/40 to-background">
      <div className="container mx-auto px-4 py-12 space-y-8">
        <section className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-primary">
              Cart
            </p>
            <h1 className="text-3xl font-bold md:text-4xl flex items-center gap-2">
              <ShoppingCart className="h-7 w-7" />
              Your bag
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Review the items you&apos;ve added before proceeding to checkout.
            </p>
          </div>
          <Badge variant="outline" className="w-fit">
            {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
          </Badge>
        </section>

        {items.length === 0 ? (
          <Card className="border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle>Cart is empty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                You don&apos;t have any items in your cart yet. Browse our
                collection and add something you like.
              </p>
              <Button asChild>
                <a href="/products">Continue shopping</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
            {/* Cart Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="border-primary/10 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link href={`/products/${item.product.id}`} className="shrink-0">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <Link href={`/products/${item.product.id}`}>
                              <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                                {item.product.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.product.category}
                            </p>
                            {(item.size || item.color) && (
                              <div className="flex gap-2 mt-2">
                                {item.size && (
                                  <Badge variant="outline" className="text-xs">
                                    Size: {item.size}
                                  </Badge>
                                )}
                                {item.color && (
                                  <Badge variant="outline" className="text-xs">
                                    Color: {item.color}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={removingItemId === item.id}
                            className="shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updatingItemId === item.id}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">
                              {updatingItemId === item.id ? "..." : item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= 10 || updatingItemId === item.id}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              SAR {(item.product.price * item.quantity).toFixed(2)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-muted-foreground">
                                SAR {item.product.price} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Clear Cart Button */}
              {items.length > 0 && (
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear cart
                </Button>
              )}
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="text-sm font-semibold text-foreground/80">Rewards Journey</p>
              <p>This order forms {orderPoints} fragments.</p>
              {currentPoints !== null && (
                <p>Progress: {currentPoints}/{MAX_PROGRESS}</p>
              )}
              <p>This order moves you one step forward. Some steps unlock rewards.</p>
              <p className="text-xs text-muted-foreground/70">
                You&apos;ll see your progress after checkout.
              </p>
            </div>

            {/* Order Summary */}
            <Card className="border-primary/10 shadow-sm h-fit sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">SAR {getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">SAR {shippingAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items</span>
                    <span className="font-medium">{getTotalItems()}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>SAR {(getTotalPrice() + shippingAmount).toFixed(2)}</span>
                  </div>
                </div>

                <Button size="lg" className="w-full" asChild>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
