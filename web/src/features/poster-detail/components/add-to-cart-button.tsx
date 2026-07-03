import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  isAvailable: boolean;
  isInCart: boolean;
  cartQuantity: number;
  onAddToCart: () => void;
}

export const AddToCartButton = ({
  isAvailable,
  isInCart,
  cartQuantity,
  onAddToCart,
}: AddToCartButtonProps) => {
  return (
    <div className="flex gap-3">
      <Button
        onClick={onAddToCart}
        disabled={!isAvailable}
        className="flex-1 h-12 text-base font-semibold"
        size="lg"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        Add to Cart
      </Button>
      {isInCart && (
        <p className="text-sm text-muted-foreground">{cartQuantity} in cart</p>
      )}
    </div>
  );
};
