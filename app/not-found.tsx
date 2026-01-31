import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* 404 Text */}
        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/products">
              <Search className="h-4 w-4" />
              Browse Products
            </Link>
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">You might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/products?category=hoodies" className="text-sm hover:underline">
              Hoodies
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/products?category=tshirts" className="text-sm hover:underline">
              T-Shirts
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/cart" className="text-sm hover:underline">
              Cart
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/account" className="text-sm hover:underline">
              Account
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/contact" className="text-sm hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
