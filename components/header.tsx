"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, Search, X, Heart, Gift, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

import { SearchCommand } from "@/components/search-command";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useAuth } from "@/contexts/auth-context";
import { Badge } from "@/components/ui/badge";
import ArrowButton from "@/components/ui/arrow-button";
import { FRAGMENTS_KEY, clampProgress } from "@/lib/rewards";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentPoints, setCurrentPoints] = useState(0);
  const { getTotalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const cartItemsCount = getTotalItems();
  const wishlistItemsCount = wishlistItems.length;

  // Sync points from localStorage or database
  useEffect(() => {
    const syncPoints = () => {
      if (isAuthenticated && user?.fragmentPoints !== undefined) {
        // For logged-in users, use database points
        setCurrentPoints(user.fragmentPoints);
      } else {
        // For guest users, use localStorage
        const storedPoints = Number(localStorage.getItem(FRAGMENTS_KEY) || "0");
        setCurrentPoints(clampProgress(storedPoints));
      }
    };

    syncPoints();

    // Listen for points updates
    const handlePointsUpdate = () => syncPoints();
    window.addEventListener("oiko:points-updated", handlePointsUpdate);

    return () => {
      window.removeEventListener("oiko:points-updated", handlePointsUpdate);
    };
  }, [user?.fragmentPoints, isAuthenticated]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 items-center justify-between pl-2 pr-2 md:pr-4">
        {/* Logo */}
        <Link href="/" className="flex items-center px-0 md:px-6">
          <div className="flex items-center md:-ml-6">
            <Image
              src="/images/logo.svg"
              alt="Oiko Logo"
              width={50}
              height={50}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
          <Link href="/">
            <ArrowButton text="HOME" />
          </Link>
          <Link href="/customize">
            <ArrowButton text="CUSTOMIZE" />
          </Link>
          <Link href="/shipping">
            <ArrowButton text="SHIPPING" />
          </Link>
          <Link href="/return">
            <ArrowButton text="RETURN" />
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => setSearchOpen(true)}
            aria-label="Search products"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Link href="/wishlist">
            <Button id="header-wishlist-btn" variant="ghost" size="icon" className="relative">
              <Heart className={`h-5 w-5 ${wishlistItemsCount > 0 ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </Link>
          <Link href="/rewards">
            <Button variant="ghost" size="icon" className="relative">
              <Gift className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/cart">
            <Button id="header-cart-btn" variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemsCount > 9 ? "9+" : cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/rewards" className="cursor-pointer">
                    <Gift className="mr-2 h-4 w-4" />
                    Rewards ({currentPoints} points)
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon" className="relative">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <nav className="container mx-auto py-8 px-6 flex flex-col items-center space-y-6">
            <Button
              variant="outline"
              className="w-48 flex items-center gap-2"
              onClick={() => {
                setSearchOpen(true);
                setMobileMenuOpen(false);
              }}
            >
              <Search className="h-4 w-4" />
              Search Products
            </Button>
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <ArrowButton text="HOME" className="w-48" />
            </Link>
            <Link href="/customize" onClick={() => setMobileMenuOpen(false)}>
              <ArrowButton text="CUSTOMIZE" className="w-48" />
            </Link>
            <Link href="/rewards" onClick={() => setMobileMenuOpen(false)}>
              <ArrowButton text="FRAGMENTS" className="w-48" />
            </Link>
            <Link href="/products?category=hoodies" onClick={() => setMobileMenuOpen(false)}>
              <ArrowButton text="HOODIES" className="w-48" />
            </Link>
            <Link href="/products?category=tshirts" onClick={() => setMobileMenuOpen(false)}>
              <ArrowButton text="T-SHIRTS" className="w-48" />
            </Link>
            <Link href="/products?category=accessories" onClick={() => setMobileMenuOpen(false)}>
              <ArrowButton text="ACCESSORIES" className="w-48" />
            </Link>
            <Link href="/products" onClick={() => setMobileMenuOpen(false)}>
              <ArrowButton text="ALL PRODUCTS" className="w-48" />
            </Link>
          </nav>
        </div>
      )}

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
