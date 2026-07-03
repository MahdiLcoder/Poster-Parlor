import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth, CurrentUser, Public } from '@poster-parlor-api/auth';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileStructure } from '@poster-parlor-api/shared';
import type { AuthenticatedUser } from '@poster-parlor-api/shared';
import { createReviewDto, UserRole } from '@poster-parlor-api/models';

import { HttpResponseUtil } from '@poster-parlor-api/utils';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewServie: ReviewService) {}

  @Post(':id')
  @Auth()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
  async createReview(
    @Param('id') id: string,
    @UploadedFiles() files: { images?: FileStructure[] },

    @Body() reviewDetails: createReviewDto,

    @CurrentUser() user: AuthenticatedUser
  ) {
    const newImage = files.images || [];
    const userId = user.id;
    const posterId = id;
    const review = await this.reviewServie.createReview(
      reviewDetails,
      newImage,
      userId,
      posterId
    );

    return review;
  }

  @Put(':id')
  @Auth()
  async updateReview(
    @Param('id') id: string,
    @UploadedFiles() files: { images?: FileStructure[] },

    @Body() reviewDetails: createReviewDto,

    @CurrentUser() user: AuthenticatedUser
  ) {
    const userId = user.id;

    const role = user.role;

    const newImages = files.images || [];

    const updateReview = await this.reviewServie.updateReview(
      id,
      role,
      reviewDetails,
      userId,
      newImages
    );
    return updateReview;
  }

  @Get(':id')
  @Public()
  async getProductReview(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sort') sort = 'newest',
    @Query('rating') rating: number,
    @Query('hasImage') hasImage?: string
  ) {
    const review = await this.reviewServie.getProductReview(
      id,
      page,
      limit,
      sort,
      rating,
      hasImage === 'true'
    );

    return review;
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  async deleteReview(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    await this.reviewServie.deleteReview(id, user.id, user.role);

    return HttpResponseUtil.deleted('Review deleted Successfully');
  }
}
