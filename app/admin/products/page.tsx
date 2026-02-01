'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, MoreVertical, Plus, Trash2, Star } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getProducts, bulkProductOperation } from "@/lib/api";
import { TableSkeleton } from "@/components/admin/loading-skeleton";
import { EmptyState } from "@/components/admin/empty-state";
import { toast } from "sonner";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts({
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchQuery || undefined,
      });

      if (response.success) {
        setProducts(response.data || []);
      } else {
        toast.error(response.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    try {
      const response = await bulkProductOperation({
        operation: 'delete',
        productIds: selectedProducts,
      });

      if (response.success) {
        toast.success(`${selectedProducts.length} products deleted`);
        setSelectedProducts([]);
        fetchProducts();
      } else {
        toast.error(response.error || 'Failed to delete products');
      }
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Failed to delete products');
    }
  };

  const handleBulkFeatured = async () => {
    if (selectedProducts.length === 0) return;

    try {
      const response = await bulkProductOperation({
        operation: 'update',
        productIds: selectedProducts,
        updates: { featured: true },
      });

      if (response.success) {
        toast.success(`${selectedProducts.length} products marked as featured`);
        setSelectedProducts([]);
        fetchProducts();
      } else {
        toast.error(response.error || 'Failed to update products');
      }
    } catch (error) {
      console.error('Error updating products:', error);
      toast.error('Failed to update products');
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const response = await bulkProductOperation({
        operation: 'delete',
        productIds: [productToDelete._id],
      });

      if (response.success) {
        toast.success('Product deleted successfully');
        setDeleteDialogOpen(false);
        setProductToDelete(null);
        fetchProducts();
      } else {
        toast.error(response.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleToggleFeatured = async (product: any) => {
    try {
      const response = await bulkProductOperation({
        operation: 'update',
        productIds: [product._id],
        updates: { featured: !product.featured },
      });

      if (response.success) {
        toast.success(product.featured ? 'Removed from featured' : 'Added to featured');
        fetchProducts();
      } else {
        toast.error(response.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(p => p._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      hoodies: 'bg-blue-100 text-blue-700',
      tshirts: 'bg-green-100 text-green-700',
      hats: 'bg-yellow-100 text-yellow-700',
      socks: 'bg-purple-100 text-purple-700',
      totebags: 'bg-pink-100 text-pink-700',
      custom: 'bg-orange-100 text-orange-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog and inventory
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="hoodies">Hoodies</SelectItem>
              <SelectItem value="tshirts">T-Shirts</SelectItem>
              <SelectItem value="hats">Hats</SelectItem>
              <SelectItem value="socks">Socks</SelectItem>
              <SelectItem value="totebags">Tote Bags</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <span className="font-medium">{selectedProducts.length} selected</span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleBulkFeatured}
            >
              <Star className="h-4 w-4 mr-1" />
              Mark Featured
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedProducts([])}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <TableSkeleton />
      ) : products.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No products found"
          description="No products match your current filters. Try adjusting your search criteria."
        />
      ) : (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedProducts.length === products.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product._id)}
                        onCheckedChange={(checked) => handleSelectProduct(product._id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getCategoryColor(product.category)}>
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <span className={product.stock === 0 ? 'text-red-600' : ''}>
                        {product.stock || 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      {product.featured && (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {product.colors?.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {product.colors.length} colors
                          </Badge>
                        )}
                        {product.sizes?.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {product.sizes.length} sizes
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/products/${product._id}`)}>
                            View Product
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleFeatured(product)}>
                            {product.featured ? 'Remove from Featured' : 'Mark as Featured'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setProductToDelete(product);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600"
                          >
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{' '}
              <span className="font-semibold">{productToDelete?.name}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
