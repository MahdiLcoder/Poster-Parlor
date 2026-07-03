import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from '@poster-parlor-api/models';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { CloudinaryService } from '@poster-parlor-api/inventory';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, CloudinaryService],
  exports: [ReviewService],
})
export class ReviewModule {}
