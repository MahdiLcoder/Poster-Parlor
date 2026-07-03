import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProductSpecificationsProps {
  dimensions: string;
  material: string;
  category: string;
  stock: number;
}

export const ProductSpecifications = ({
  dimensions,
  material,
  category,
  stock,
}: ProductSpecificationsProps) => {
  return (
    <Card>
      <CardContent className="p-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Dimensions:</span>
          <span className="font-semibold text-foreground">{dimensions}</span>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Material:</span>
          <span className="font-semibold text-foreground">{material}</span>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Category:</span>
          <Badge variant="secondary" className="capitalize">
            {category}
          </Badge>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Stock:</span>
          <span
            className={`font-semibold ${
              stock < 5
                ? "text-red-600 dark:text-red-400"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            {stock < 5 ? `Only ${stock} left!` : `${stock} available`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
