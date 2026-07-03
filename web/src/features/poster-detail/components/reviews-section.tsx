import { Check, ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "./star-rating";
import { ReviewForm } from "./review-form";
import { Review, ReviewStats, ReviewPagination } from "../types";

// Simple relative date formatter
const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

interface ReviewsSectionProps {
  posterId: string;
  reviews: Review[];
  stats: ReviewStats;
  pagination: ReviewPagination;
  isLoading: boolean;
  onLoadMore?: () => void;
  onReviewSubmit?: () => void;
}

interface RatingBarProps {
  star: number;
  count: number;
  total: number;
}

const RatingBar = ({ star, count, total }: RatingBarProps) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground w-14">{star} star</span>
      <div className="flex-1 bg-muted rounded-full h-2">
        <div
          className="bg-yellow-400 h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-muted-foreground w-12 text-right">
        {percentage}%
      </span>
    </div>
  );
};

interface ReviewItemProps {
  review: Review;
}

const ReviewItem = ({ review }: ReviewItemProps) => {
  const authorName = review.userId?.name || "Anonymous";
  const formattedDate = formatRelativeDate(review.createdAt);

  return (
    <article className="border-b border-border pb-6 last:border-b-0">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h4 className="font-semibold text-foreground">{authorName}</h4>
            <Badge
              variant="outline"
              className="text-green-600 border-green-600 dark:text-green-400 dark:border-green-400"
            >
              <Check className="w-3 h-3 mr-1" />
              Verified Purchase
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} size="sm" />
            <time className="text-sm text-muted-foreground">
              {formattedDate}
            </time>
          </div>
        </div>
      </div>
      {review.comment && (
        <p className="text-muted-foreground leading-relaxed mb-3">
          {review.comment}
        </p>
      )}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {review.images.map((image, index) => (
            <img
              key={image.public_id || index}
              src={image.url}
              alt={`Review image ${index + 1}`}
              className="w-16 h-16 object-cover rounded-md border"
            />
          ))}
        </div>
      )}
    </article>
  );
};

const ReviewsSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </div>
    ))}
  </div>
);

const EmptyReviews = () => (
  <div className="text-center py-12">
    <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
    <h3 className="text-lg font-semibold text-foreground mb-2">
      No reviews yet
    </h3>
    <p className="text-muted-foreground">
      Be the first to review this product!
    </p>
  </div>
);

export const ReviewsSection = ({
  posterId,
  reviews,
  stats,
  pagination,
  isLoading,
  onLoadMore,
  onReviewSubmit,
}: ReviewsSectionProps) => {
  const averageRating = stats?.averageRating
    ? Number(stats.averageRating.toFixed(1))
    : 0;
  const totalReviews = stats?.totalReviews || 0;
  const ratingDistribution = stats?.ratingDistribution || {};

  return (
    <div>
      {/* Review Form */}
      <ReviewForm posterId={posterId} onSuccess={onReviewSubmit} />

      <Card>
        <CardContent className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            Customer Reviews
          </h2>

          {/* Review Summary */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 pb-8 border-b border-border mb-8">
            <div className="text-center md:min-w-[120px]">
              <p className="text-5xl font-bold text-foreground mb-2">
                {averageRating}
              </p>
              <div className="flex justify-center mb-2">
                <StarRating rating={averageRating} size="md" />
              </div>
              <p className="text-sm text-muted-foreground">
                {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>

            <div className="flex-1 w-full space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <RatingBar
                  key={star}
                  star={star}
                  count={ratingDistribution[star] || 0}
                  total={totalReviews}
                />
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          {isLoading ? (
            <ReviewsSkeleton />
          ) : reviews.length === 0 ? (
            <EmptyReviews />
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewItem key={review._id} review={review} />
              ))}
            </div>
          )}

          {pagination?.hasNextPage && onLoadMore && (
            <Button
              variant="outline"
              className="mt-8 w-full"
              onClick={onLoadMore}
            >
              Load More Reviews
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
