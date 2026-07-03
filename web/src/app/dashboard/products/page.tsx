"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SmartPagination } from "@/components/ui/smart-pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { TableLoadingSkeleton } from "@/components/ui/loading-skeletons";
import { SearchInput } from "@/components/ui/search-input";
import { PageHeader } from "@/components/ui/page-header";
import {
  StockStatusBadge,
  ActiveStatusBadge,
} from "@/components/ui/status-badge";
import { LoadingButton } from "@/components/ui/loading-button";
import { formatPrice } from "@/lib/helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  Loader2,
  ImageIcon,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useGetAllInventoryQuery,
  useDeleteInventoryItemMutation,
  useSoftDeleteInventoryItemMutation,
  useGetAllFiltersQuery,
  Poster,
} from "@/store/api/inventory.api";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

export default function ProductsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Poster | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, error, refetch, isFetching } =
    useGetAllInventoryQuery({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      filters: {
        search: debouncedSearch || undefined,
        category: categoryFilter === "all" ? undefined : categoryFilter,
      },
    });

  const { data: filtersData } = useGetAllFiltersQuery();
  const [softDelete, { isLoading: isSoftDeleting }] =
    useSoftDeleteInventoryItemMutation();
  const [hardDelete, { isLoading: isHardDeleting }] =
    useDeleteInventoryItemMutation();

  const products = data?.data?.posters || [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.pages || 1;
  const categories = (filtersData?.data?.categories || []).map(
    (c) => c.category
  );

  const handleDelete = async (id: string, hard: boolean = false) => {
    try {
      if (hard) {
        await hardDelete(id).unwrap();
        toast.success("Product permanently deleted");
      } else {
        await softDelete(id).unwrap();
        toast.success("Product deleted successfully");
      }
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const openProductDetails = (product: Poster) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleOnAddProduct = () => {
    router.push("/dashboard/products/add");
  };

  const handleEditProduct = (id: string) => {
    router.push(`/dashboard/products/add?edit=${id}`);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive">Failed to load products</p>
        <LoadingButton onClick={() => refetch()} variant="outline">
          Retry
        </LoadingButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your poster collection"
        icon={Package}
        showRefresh
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        actions={
          <Button onClick={handleOnAddProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        }
      />

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <SearchInput
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="flex-1"
            />

            {/* Category Filter */}
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Products {pagination && `(${pagination.total})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableLoadingSkeleton rows={5} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products found"
              description={
                debouncedSearch || categoryFilter !== "all"
                  ? "Try adjusting your filters"
                  : undefined
              }
              secondaryActionLabel="Add Your First Product"
              onSecondaryAction={handleOnAddProduct}
              size="sm"
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                            {product.images?.[0]?.url ? (
                              <Image
                                src={product.images[0].url}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate max-w-[200px]">
                              {product.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {product.dimensions}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell>
                        <StockStatusBadge stock={product.stock} />
                      </TableCell>
                      <TableCell>
                        <ActiveStatusBadge
                          isActive={product.isAvailable && product.stock > 0}
                          activeLabel="Active"
                          inactiveLabel="Out of Stock"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openProductDetails(product)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <Link
                              href={`/posters/${product._id}`}
                              target="_blank"
                            >
                              <DropdownMenuItem>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View on Site
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleEditProduct(product._id)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setProductToDelete(product._id);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <SmartPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={pagination?.total}
        itemLabel="products"
        onPageChange={setCurrentPage}
        className="justify-center"
      />

      {/* Product Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.title}</DialogTitle>
                <DialogDescription>
                  Product details and information
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                {/* Images */}
                <div className="grid grid-cols-4 gap-2">
                  {selectedProduct.images.map((image, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                    >
                      <Image
                        src={image.url}
                        alt={`${selectedProduct.title} ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-semibold">
                          ₹{selectedProduct.price}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stock</span>
                        <span>{selectedProduct.stock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category</span>
                        <Badge variant="secondary">
                          {selectedProduct.category}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Dimensions
                        </span>
                        <span>{selectedProduct.dimensions}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge
                          variant={
                            selectedProduct.isAvailable
                              ? "default"
                              : "destructive"
                          }
                        >
                          {selectedProduct.isAvailable ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created</span>
                        <span className="text-sm">
                          {new Date(
                            selectedProduct.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Updated</span>
                        <span className="text-sm">
                          {new Date(
                            selectedProduct.updatedAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Description */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {selectedProduct.description || "No description provided"}
                    </p>
                  </CardContent>
                </Card>

                {/* Tags */}
                {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsDetailsOpen(false);
                    handleEditProduct(selectedProduct._id);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Product
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                productToDelete && handleDelete(productToDelete, false)
              }
              disabled={isSoftDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSoftDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
