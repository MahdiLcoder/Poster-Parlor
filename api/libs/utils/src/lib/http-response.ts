/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@poster-parlor-api/shared';

export class HttpResponseUtil {
  private static createResponse<T>(
    success: boolean,
    message: string,
    statusCode: HttpStatus,
    data?: T,
    error?: any,
    path?: string
  ): ApiResponse<T> {
    return {
      success,
      message,
      data,
      error,
      statusCode,
      timestamp: new Date().toISOString(),
      path: path || '',
    };
  }

  // Success responses
  static success<T>(
    data: T,
    message = 'Success',
    path?: string
  ): ApiResponse<T> {
    return this.createResponse(
      true,
      message,
      HttpStatus.OK,
      data,
      undefined,
      path
    );
  }

  static created<T>(
    data: T,
    message = 'Resource created successfully',
    path?: string
  ): ApiResponse<T> {
    return this.createResponse(
      true,
      message,
      HttpStatus.CREATED,
      data,
      undefined,
      path
    );
  }

  static updated<T>(
    data: T,
    message = 'Resource updated successfully',
    path?: string
  ): ApiResponse<T> {
    return this.createResponse(
      true,
      message,
      HttpStatus.OK,
      data,
      undefined,
      path
    );
  }

  static deleted(
    message = 'Resource deleted successfully',
    path?: string
  ): ApiResponse<null> {
    return this.createResponse(
      true,
      message,
      HttpStatus.OK,
      null,
      undefined,
      path
    );
  }
}
