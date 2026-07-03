import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from '@poster-parlor-api/inventory';
import {
  ReviewDocument,
  Review,
  createReviewDto,
  ReviewImage,
  updateReviewDto,
  UserRole,
} from '@poster-parlor-api/models';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { FileStructure } from '@poster-parlor-api/shared';
import {
  BadRequestException,
  ConflictException,
  CustomHttpException,
  ForbiddenException,
  NotFoundException,
  ValidationException,
} from '@poster-parlor-api/utils';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class ReviewService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>
  ) {}

  // Create Review
  public async createReview(
    reviewDetails: createReviewDto,
    images: FileStructure[],
    userId: string,
    posterId: string
  ) {
    if (!userId || !posterId) {
      throw new NotFoundException(
        'UserId and PosterId are required to create a review'
      );
    }

    if (!this.isValidObjectId(userId) || !this.isValidObjectId(posterId)) {
      throw new BadRequestException('Invalid UserId and PosterId format');
    }

    const existingReview = await this.reviewModel.findOne({
      userId: userId,
      posterId: posterId,
    });

    if (existingReview) {
      throw new ConflictException(
        'You have already reviewed this poster. You can only submit one review per poster'
      );
    }

    let uploadResults: UploadApiResponse[] = [];

    try {
      if (images && images.length > 0) {
        uploadResults = await this.cloudinaryService.uploadMultipleImages(
          images
        );
      }

      const imageUploadResults: ReviewImage[] = uploadResults.map((res) => ({
        url: res.secure_url,
        public_id: res.public_id,
        format: res.format,
        width: res.width,
        height: res.height,
      }));

      const newReview = new this.reviewModel({
        userId,
        posterId,
        ...reviewDetails,
        images: imageUploadResults,
      });

      return await newReview.save();
    } catch (error) {
      // Cleanup uploaded images on error
      if (uploadResults.length > 0) {
        await this.cloudinaryService.deleteMultipleImages(
          uploadResults.map((res) => res.public_id)
        );
      }

      // Re-throw the error so caller knows creation failed
      throw new CustomHttpException(
        'Failed to create review',
        500,
        'REVIEW_CREATION_ERROR',
        error
      );
    }
  }

  public async updateReview(
    reviewId: string,
    role: UserRole,
    reviewDetails: updateReviewDto,
    userId: string,
    images: FileStructure[]
  ) {
    if (!userId || !reviewId) {
      throw new NotFoundException(
        'UserId and ReviewId are required to update a review'
      );
    }

    if (!this.isValidObjectId(userId) || !this.isValidObjectId(reviewId)) {
      throw new BadRequestException('Invalid UserId and ReviewId format');
    }

    const existingReview = await this.reviewModel.findById(reviewId);

    if (!existingReview) {
      throw new NotFoundException('Review Not Found');
    }

    if (
      role !== UserRole.ADMIN &&
      existingReview.userId.toString() !== userId
    ) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    let uploadResult: UploadApiResponse[] = [];
    let imagesToDeleteFromCloud: string[] = [];

    try {
      const existingImages = existingReview.images || [];
      let finalImages: ReviewImage[] = [];

      if (reviewDetails.imageAction === 'replace') {
        // Mark existing images for deletion
        if (existingImages.length > 0) {
          imagesToDeleteFromCloud = existingImages.map((img) => img.public_id);
        }

        // Upload new images
        if (images && images.length > 0) {
          uploadResult = await this.cloudinaryService.uploadMultipleImages(
            images
          );
          finalImages = uploadResult.map((res) => ({
            url: res.secure_url,
            public_id: res.public_id,
            format: res.format,
            width: res.width,
            height: res.height,
          }));
        }
      } else {
        // Keep existing images by default
        finalImages = [...existingImages];

        // Remove specific images if requested
        if (
          reviewDetails.imagesToDelete &&
          reviewDetails.imagesToDelete.length > 0
        ) {
          const publicIdsToDelete = reviewDetails.imagesToDelete;

          // Mark for cloud deletion
          imagesToDeleteFromCloud = publicIdsToDelete;

          // Filter out from final images
          finalImages = finalImages.filter(
            (img) => !publicIdsToDelete.includes(img.public_id)
          );
        }

        // Add new images
        if (images && images.length > 0) {
          uploadResult = await this.cloudinaryService.uploadMultipleImages(
            images
          );

          const newReviewImages: ReviewImage[] = uploadResult.map((res) => ({
            url: res.secure_url,
            public_id: res.public_id,
            format: res.format,
            width: res.width,
            height: res.height,
          }));

          finalImages = [...finalImages, ...newReviewImages];
        }
      }

      // Validate image count
      if (finalImages.length > 5) {
        throw new ValidationException('Max 5 images are allowed per review');
      }

      // Prepare update data
      const { imageAction, imagesToDelete, ...reviewFields } = reviewDetails;

      const updateReview: Partial<Review> = {
        ...reviewFields,
        images: finalImages,
      };

      // Update the review
      const updatedData = await this.reviewModel.findByIdAndUpdate(
        reviewId,
        updateReview,
        { new: true }
      );

      // Delete images from cloud after successful update
      if (imagesToDeleteFromCloud.length > 0) {
        await this.cloudinaryService.deleteMultipleImages(
          imagesToDeleteFromCloud
        );
      }

      return updatedData;
    } catch (err) {
      // Cleanup newly uploaded images on error
      if (uploadResult.length > 0) {
        const uploadPublicIds = uploadResult.map((img) => img.public_id);
        await this.cloudinaryService.deleteMultipleImages(uploadPublicIds);
      }

      throw new CustomHttpException(
        'Update Review Failed',
        500,
        'REVIEW_UPDATE_ERROR',
        err
      );
    }
  }

  async getProductReview(
    posterId: string,
    page = 1,
    limit = 10,
    sort = 'newest',
    rating?: number,
    hasImages?: boolean
  ) {
    if (!this.isValidObjectId(posterId)) {
      throw new BadRequestException('Invalid PosterId format');
    }

    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 10;

    const skip = (page - 1) * limit;

    const filter: FilterQuery<ReviewDocument> = { posterId };

    if (rating && rating >= 1 && rating <= 5) {
      filter.rating = rating;
    }

    if (hasImages) {
      filter['images.0'] = { $exists: true };
    }

    let sortOption: any = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'highest':
        sortOption = { rating: -1, createdAt: -1 };
        break;
      case 'lowest':
        sortOption = { rating: 1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const [reviews, totalReviews, ratingStats] = await Promise.all([
      this.reviewModel
        .find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email')
        .lean()
        .exec(),

      this.reviewModel.countDocuments(filter),

      this.reviewModel.aggregate([
        { $match: { posterId: new mongoose.Types.ObjectId(posterId) } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
          },
        },
      ]),
    ]);

    const ratingDistribution = await this.reviewModel.aggregate([
      { $match: { posterId: new mongoose.Types.ObjectId(posterId) } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
    ]);

    const distribution: { [key: number]: number } = {};
    for (let index = 1; index <= 5; index++) {
      distribution[index] = 0;
    }

    ratingDistribution.forEach((item) => {
      distribution[item._id] = item.count;
    });

    const totalPages = Math.ceil(totalReviews / limit);

    return {
      reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      stats: {
        averageRating: ratingStats[0]?.averageRating || 0,
        totalReviews: ratingStats[0]?.totalReviews || 0,
        ratingDistribution: distribution,
      },
    };
  }

  public async deleteReview(reviewId: string, userId: string, role: UserRole) {
    if (!this.isValidObjectId(reviewId)) {
      throw new BadRequestException('Invalid ReviewId format');
    }

    const existingReview = await this.reviewModel.findById(reviewId);

    if (!existingReview) {
      throw new NotFoundException('No Review found to delete');
    }

    if (
      role !== UserRole.ADMIN &&
      existingReview.userId.toString() !== userId
    ) {
      throw new ForbiddenException('You can only delete your own review');
    }

    // Delete images from Cloudinary before deleting review
    if (existingReview.images && existingReview.images.length > 0) {
      const publicIds = existingReview.images.map((img) => img.public_id);
      await this.cloudinaryService.deleteMultipleImages(publicIds);
    }

    await this.reviewModel.findByIdAndDelete(reviewId);

    return { message: 'Review deleted successfully' };
  }

  // Helper
  private isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }
}
