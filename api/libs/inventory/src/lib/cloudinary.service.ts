import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@poster-parlor-api/config';
import { FileStructure } from '@poster-parlor-api/shared';
import {
  v2 as cloudinary,
  DeleteApiResponse,
  UploadApiResponse,
} from 'cloudinary';
import { CustomHttpException } from '@poster-parlor-api/utils';
import { Readable } from 'stream';
@Injectable()
export class CloudinaryService {
  constructor(private cloudConfig: AppConfigService) {
    cloudinary.config({
      cloud_name: this.cloudConfig.cloudinaryConfig.cloudinaryName,
      api_key: this.cloudConfig.cloudinaryConfig.cloudinaryApiKey,
      api_secret: this.cloudConfig.cloudinaryConfig.cloudinaryApiSecret,
    });
  }

  async uploadImage(file: FileStructure): Promise<UploadApiResponse> {
    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'Posters', resource_type: 'image' },
          (error, res) => {
            if (error) return reject(error);
            resolve(res as UploadApiResponse);
          }
        );

        const readbale = this.bufferToReadable(file.buffer);
        readbale.pipe(uploadStream);
      });
      if (!result || !result.secure_url) {
        throw new CustomHttpException(
          'Cloudinary upload failed : No URL returned'
        );
      }
      return result;
    } catch (err) {
      throw new CustomHttpException(
        'Failed to Upload image to Cloudinary',
        500,
        'CLOUDINARY_ERROR',
        err
      );
    }
  }

  async uploadMultipleImages(
    files: FileStructure[]
  ): Promise<UploadApiResponse[]> {
    if (!files || files.length === 0) {
      throw new CustomHttpException('No File provided for upload', 400);
    }

    const uploadPromises = files.map((file) => this.uploadImage(file));

    try {
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (err) {
      throw new CustomHttpException(
        'Failed to upload multiple images ',
        500,
        'CLOUDINARY_ERROR',
        err
      );
    }
  }
  async deleteImage(publicId: string): Promise<DeleteApiResponse> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
      });

      if (result.result !== 'ok' && result.result !== 'notfound') {
        throw new CustomHttpException(
          `Cloudinary delete image service failed: ${result.result}`
        );
      }
      return result;
    } catch (err) {
      throw new CustomHttpException(
        `Failed to delete image from cloudinary`,
        500,
        'CLOUDINARY_ERROR',
        err
      );
    }
  }
  async deleteMultipleImages(publicIds: string[]): Promise<void> {
    try {
      const deletePromise = publicIds.map((id) => {
        this.deleteImage(id);
      });

      await Promise.all(deletePromise);
    } catch (err) {
      throw new CustomHttpException(
        'Failed to delete multiple images from cloudinary',
        500,
        'CLOUDINARY_ERROR',
        err
      );
    }
  }
  ///Helper
  bufferToReadable(buffer: Buffer): Readable {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }
}
