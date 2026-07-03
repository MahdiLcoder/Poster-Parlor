import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

const reviews = [
  { rating: 5, count: 4000 },
  { rating: 4, count: 2100 },
  { rating: 3, count: 800 },
  { rating: 2, count: 631 },
  { rating: 1, count: 344 },
];

const totalReviews = reviews.reduce((sum, review) => sum + review.count, 0);
const avgRating = (
  reviews.reduce((sum, review) => sum + review.rating * review.count, 0) /
  totalReviews
).toFixed(1);

export function CustomerReviews() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Customer Reviews
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Based on {totalReviews.toLocaleString()} verified purchases
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Average Rating */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{avgRating}</div>
              <div className="flex gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(parseFloat(avgRating))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {reviews.map((review) => (
                <div key={review.rating} className="flex items-center gap-2">
                  <span className="text-sm w-8">{review.rating}★</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width: `${
                          (review.count /
                            Math.max(...reviews.map((r) => r.count))) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {review.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
