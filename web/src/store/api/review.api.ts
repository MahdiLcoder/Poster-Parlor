import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./base.query";

export interface ReviewImage {
  url: string;
  public_id: string;
  format?: string;
  width?: number;
  height?: number;
}

export interface ReviewUser {
  _id: string;
  name: string;
  email: string;
}

export interface Review {
  _id: string;
  userId: ReviewUser;
  posterId: string;
  rating: number;
  comment?: string;
  images?: ReviewImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewPagination {
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}

export interface GetProductReviewsResponse {
  success: boolean;
  message: string;
  data: {
    reviews: Review[];
    pagination: ReviewPagination;
    stats: ReviewStats;
  };
  path: string;
  timestamp: string;
}

export interface GetProductReviewsParams {
  posterId: string;
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest" | "highest" | "lowest";
  rating?: number;
  hasImage?: boolean;
}

export interface CreateReviewParams {
  posterId: string;
  rating: number;
  comment?: string;
  images?: File[];
}

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Reviews"],
  endpoints: (builder) => ({
    getProductReviews: builder.query<
      GetProductReviewsResponse,
      GetProductReviewsParams
    >({
      query: ({
        posterId,
        page = 1,
        limit = 10,
        sort = "newest",
        rating,
        hasImage,
      }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        params.append("sort", sort);
        if (rating) params.append("rating", rating.toString());
        if (hasImage) params.append("hasImage", "true");

        return {
          url: `/review/${posterId}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, { posterId }) => [
        { type: "Reviews", id: posterId },
      ],
    }),

    createReview: builder.mutation<Review, CreateReviewParams>({
      query: ({ posterId, rating, comment, images }) => {
        const formData = new FormData();
        formData.append("rating", rating.toString());
        if (comment) formData.append("comment", comment);
        if (images) {
          images.forEach((image) => {
            formData.append("images", image);
          });
        }

        return {
          url: `/review/${posterId}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { posterId }) => [
        { type: "Reviews", id: posterId },
      ],
    }),
  }),
});

export const { useGetProductReviewsQuery, useCreateReviewMutation } = reviewApi;
