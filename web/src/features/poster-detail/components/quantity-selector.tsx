import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  quantity: number;
  stock: number;
  price: number;
  onQuantityChange: (type: "increment" | "decrement") => void;
}

export const QuantitySelector = ({
  quantity,
  stock,
  price,
  onQuantityChange,
}: QuantitySelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-3">
        Quantity
      </label>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center border-2 border-border rounded-lg overflow-hidden bg-background">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onQuantityChange("decrement")}
            disabled={quantity <= 1}
            className="h-12 w-12 rounded-none"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="px-6 py-3 font-semibold text-lg text-foreground min-w-[60px] text-center">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onQuantityChange("increment")}
            disabled={quantity >= stock}
            className="h-12 w-12 rounded-none"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-muted-foreground">
          Total:{" "}
          <span className="font-bold text-foreground text-lg">
            ₹{(price * quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
