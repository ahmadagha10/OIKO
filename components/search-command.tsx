"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { products } from "@/lib/products";
import { Search, TrendingUp } from "lucide-react";

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!query.trim()) {
      // Show popular/featured products when no query
      return products.slice(0, 6);
    }

    const searchTerm = query.toLowerCase().trim();
    return products.filter((product) => {
      const searchableText = `${product.name} ${product.category} ${product.description}`.toLowerCase();
      return searchableText.includes(searchTerm);
    });
  }, [query]);

  const handleSelect = (productId: string) => {
    router.push(`/products/${productId}`);
    onOpenChange(false);
    setQuery("");
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search products by name, category, or description..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Search className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No products found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try searching with different keywords
            </p>
          </div>
        </CommandEmpty>
        <CommandGroup heading={query.trim() ? "Search Results" : "Popular Products"}>
          {filteredProducts.map((product) => (
            <CommandItem
              key={product.id}
              value={`${product.name} ${product.category} ${product.description}`}
              onSelect={() => handleSelect(String(product.id))}
              className="flex items-center gap-3 cursor-pointer"
            >
              {query.trim() ? (
                <Search className="h-4 w-4 text-muted-foreground" />
              ) : (
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              )}
              <div className="flex flex-col flex-1">
                <span className="text-sm font-medium">{product.name}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {product.category} • SAR {product.price}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

