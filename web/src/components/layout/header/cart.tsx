"use client";
import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "../../ui/button";
import { Badge } from "@/components/ui/badge";

import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import { useCart } from "@/features/cart";
import { CartItem } from "@/store/slices/cart.slice";

interface CartButtonProps {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const ITEMS_PER_PAGE = 3;

// Hook to safely detect client-side mounting without hydration issues
const emptySubscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

interface CartItemCardProps {
  item: CartItem;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
}

const CartItemCard = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemCardProps) => {
  return (
    <div className="group relative flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-card border border-border/50 hover:border-border hover:shadow-sm transition-all duration-200">
      {/* Product Image */}
      <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
        <Image
          src={item.imageUrl || "/placeholder.png"}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 80px, 96px"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h4 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1 pr-6">
            {item.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {item.dimensions} • {item.material}
          </p>
        </div>

        <div className="flex items-end justify-between mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
              onClick={() => onDecrement(item.posterId)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 sm:w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
              onClick={() => onIncrement(item.posterId)}
              disabled={item.quantity >= item.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Price */}
          <p className="font-bold text-sm sm:text-base text-foreground">
            ₹{(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 sm:h-7 sm:w-7 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
        onClick={() => onRemove(item.posterId)}
      >
        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    </div>
  );
};

const EmptyCart = () => (
  <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
    <div className="relative mb-6">
      <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-muted/50 flex items-center justify-center">
        <ShoppingBag className="h-12 w-12 sm:h-14 sm:w-14 text-muted-foreground/50" />
      </div>
      <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-background border-2 border-muted flex items-center justify-center">
        <Package className="h-4 w-4 text-muted-foreground/50" />
      </div>
    </div>
    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
      Your cart is empty
    </h3>
    <p className="text-sm text-muted-foreground text-center max-w-[200px]">
      Looks like you haven&apos;t added any posters yet
    </p>
  </div>
);

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-3">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-2 w-2 rounded-full transition-all ${
              currentPage === page
                ? "bg-primary w-4"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export function CartButton({ cartOpen, setCartOpen }: CartButtonProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const isClient = useIsClient();
  const router = useRouter();
  const {
    items,
    totalItems,
    subtotal,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
  } = useCart();

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 if current page becomes invalid
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRemove = (posterId: string) => {
    removeFromCart(posterId);
    // Adjust page if needed after removal
    const newTotalPages = Math.ceil((items.length - 1) / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="cart"
          className="cursor-pointer relative"
        >
          <ShoppingCart className="h-4 w-4" />
          {isClient && totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-[10px] sm:text-xs font-bold">
              {totalItems > 99 ? "99+" : totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        {/* Header */}
        <SheetHeader className="px-4 sm:px-6 pt-6 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
              Your Cart
            </SheetTitle>
            {isClient && items.length > 0 && (
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </Badge>
            )}
          </div>
        </SheetHeader>

        {/* Cart Content */}
        {!isClient || items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
              <div className="space-y-3">
                {paginatedItems.map((item) => (
                  <CartItemCard
                    key={item.posterId}
                    item={item}
                    onIncrement={incrementQuantity}
                    onDecrement={decrementQuantity}
                    onRemove={handleRemove}
                  />
                ))}
              </div>

              {/* Pagination */}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>

            {/* Footer */}
            <SheetFooter className="border-t border-border/50 px-4 sm:px-6 py-4 sm:py-6 bg-muted/30">
              <div className="w-full space-y-4">
                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-base sm:text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {subtotal < 500 && (
                    <p className="text-xs text-muted-foreground text-center">
                      Add ₹{(500 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    size="lg"
                    className="w-full font-semibold text-sm sm:text-base"
                    onClick={() => {
                      setCartOpen(false);
                      router.push("/checkout");
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-muted-foreground hover:text-destructive text-xs sm:text-sm"
                    onClick={clearCart}
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
