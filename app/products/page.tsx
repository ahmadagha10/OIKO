"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { categories, products, type Product } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { Filter, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categoryParam = searchParams.get("category");
  const subcategoryParam = searchParams.get("subcategory");

  // Filter and sort states
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const getCategoryFromParam = (param: string | null) => {
    if (!param) return "all";
    const normalizedCategory = param.toLowerCase();
    if (normalizedCategory === "t-shirts" || normalizedCategory === "tshirts") {
      return "tshirts";
    }
    if (normalizedCategory === "hoodies" || normalizedCategory === "hoodie") {
      return "hoodies";
    }
    if (normalizedCategory === "accessories") {
      return "accessories";
    }
    const matchingCategory = categories.find(
      (cat) => cat.slug.toLowerCase() === normalizedCategory
    );
    return matchingCategory ? matchingCategory.slug : "all";
  };

  const getSubcategoryFromParam = (category: string, param: string | null) => {
    if (category !== "accessories") {
      return "all";
    }
    return param ? param.toLowerCase() : "all";
  };

  const [selectedCategory, setSelectedCategory] = useState(() =>
    getCategoryFromParam(categoryParam)
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(() =>
    getSubcategoryFromParam(getCategoryFromParam(categoryParam), subcategoryParam)
  );

  // Initialize category from URL parameter
  useEffect(() => {
    const nextCategory = getCategoryFromParam(categoryParam);
    const nextSubcategory = getSubcategoryFromParam(nextCategory, subcategoryParam);
    setSelectedCategory(nextCategory);
    setSelectedSubcategory(nextSubcategory);
  }, [categoryParam, subcategoryParam]);

  const updateQuery = (category: string, subcategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
      params.delete("subcategory");
    } else {
      params.set("category", category);
      if (category === "accessories" && subcategory !== "all") {
        params.set("subcategory", subcategory);
      } else {
        params.delete("subcategory");
      }
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  // Accessories subcategories
  const accessoriesSubcategories = [
    { slug: "all", name: "All Accessories" },
    { slug: "hats", name: "Hats" },
    { slug: "socks", name: "Socks" },
    { slug: "totebags", name: "Tote Bags" },
  ];

  // Get all available colors and sizes from products
  const allColors = useMemo(() => {
    const colorSet = new Set<string>();
    products.forEach((p) => p.colors?.forEach((c) => colorSet.add(c)));
    return Array.from(colorSet).sort();
  }, []);

  const allSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    products.forEach((p) => p.sizes?.forEach((s) => sizeSet.add(s)));
    const sizes = Array.from(sizeSet);
    // Custom sort for sizes
    const sizeOrder = ["S", "M", "L", "XL", "One Size"];
    return sizes.sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));
  }, []);

  // Filter products based on category, subcategory, and filters
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((p: Product) => {
      const productCategory = p.category.toLowerCase();

      // Category filter
      if (selectedCategory !== "all") {
        if (selectedCategory === "accessories") {
          const accessoryCategories = ["hats", "socks", "totebags"];
          const isAccessory = accessoryCategories.includes(productCategory);
          if (!isAccessory) return false;
          if (selectedSubcategory !== "all" && productCategory !== selectedSubcategory.toLowerCase()) {
            return false;
          }
        } else if (productCategory !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Price filter
      if (p.price < priceRange[0] || p.price > priceRange[1]) {
        return false;
      }

      // Color filter
      if (selectedColors.length > 0) {
        if (!p.colors || !p.colors.some((c) => selectedColors.includes(c))) {
          return false;
        }
      }

      // Size filter
      if (selectedSizes.length > 0) {
        if (!p.sizes || !p.sizes.some((s) => selectedSizes.includes(s))) {
          return false;
        }
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCategory, selectedSubcategory, priceRange, selectedColors, selectedSizes, sortBy]);

  const productQuery = searchParams.toString();

  // Reset subcategory when changing main category
  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setSelectedSubcategory("all");
    updateQuery(categorySlug, "all");
  };

  // Filter handlers
  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 200]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSortBy("name-asc");
  };

  const activeFiltersCount =
    (priceRange[0] !== 0 || priceRange[1] !== 200 ? 1 : 0) +
    selectedColors.length +
    selectedSizes.length;

  const sortOptions = [
    { value: "name-asc" as SortOption, label: "Name: A-Z" },
    { value: "name-desc" as SortOption, label: "Name: Z-A" },
    { value: "price-asc" as SortOption, label: "Price: Low to High" },
    { value: "price-desc" as SortOption, label: "Price: High to Low" },
  ];

  const currentSortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label || "Sort By";

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Our Collection
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
        Pieces shaped for everyday intention.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category.slug}
            variant={selectedCategory === category.slug ? "default" : "outline"}
            onClick={() => handleCategoryChange(category.slug)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Accessories Subcategory Filter */}
      {selectedCategory === "accessories" && (
        <div className="flex flex-wrap justify-center gap-2 mb-8 pb-8 border-b">
          {accessoriesSubcategories.map((subcategory) => (
            <Button
              key={subcategory.slug}
              variant={
                selectedSubcategory === subcategory.slug ? "default" : "outline"
              }
              size="sm"
              onClick={() => {
                setSelectedSubcategory(subcategory.slug);
                updateQuery(selectedCategory, subcategory.slug);
              }}
            >
              {subcategory.name}
            </Button>
          ))}
        </div>
      )}

      {/* Filter and Sort Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {/* Mobile Filter Button */}
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your product search
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Price Range */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Price Range</Label>
                  <div className="pt-2">
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      max={200}
                      min={0}
                      step={10}
                      className="mb-2"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>SAR {priceRange[0]}</span>
                      <span>SAR {priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Colors</Label>
                  <div className="space-y-2">
                    {allColors.map((color) => (
                      <div key={color} className="flex items-center space-x-2">
                        <Checkbox
                          id={`color-${color}`}
                          checked={selectedColors.includes(color)}
                          onCheckedChange={() => handleColorToggle(color)}
                        />
                        <label
                          htmlFor={`color-${color}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer"
                        >
                          {color}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Sizes</Label>
                  <div className="space-y-2">
                    {allSizes.map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox
                          id={`size-${size}`}
                          checked={selectedSizes.includes(size)}
                          onCheckedChange={() => handleSizeToggle(size)}
                        />
                        <label
                          htmlFor={`size-${size}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {size}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearFilters}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {activeFiltersCount > 0 && (
            <span className="text-sm text-muted-foreground">
              {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'}
            </span>
          )}
        </div>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              {currentSortLabel}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={sortBy === option.value ? "bg-accent" : ""}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
        {filteredAndSortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            productLink={
              productQuery ? `/products/${product.id}?${productQuery}` : `/products/${product.id}`
            }
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg mb-4">
            No products found matching your filters.
          </p>
          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <main className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Our Collection
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Loading...
          </p>
        </div>
      </main>
    }>
      <ProductsContent />
    </Suspense>
  );
}
