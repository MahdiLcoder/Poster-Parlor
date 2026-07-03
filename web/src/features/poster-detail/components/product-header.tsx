import { StarRating } from "./star-rating";

interface ProductHeaderProps {
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
}

export const ProductHeader = ({
  title,
  price,
  rating,
  reviewCount,
}: ProductHeaderProps) => {
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
        {title}
      </h1>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <StarRating rating={rating} size="sm" />
        <span className="text-sm font-medium text-foreground">{rating}</span>
        <span className="text-sm text-muted-foreground">
          ({reviewCount} reviews)
        </span>
      </div>
      <p className="text-3xl md:text-4xl font-bold text-foreground">
        ₹{price.toFixed(2)}
      </p>
    </div>
  );
};
