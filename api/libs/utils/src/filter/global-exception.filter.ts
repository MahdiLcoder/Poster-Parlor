import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { MongoError } from 'mongodb';
import { AppLogger } from '@poster-parlor-api/logger';
import { parseStackTrace } from '../lib/stack-trace-parser';
import { handleHttpError } from './handler/http-error.handler';
import { handleMongooseValidationError } from './handler/validation-error.handler';
import { handleMongooseCastError } from './handler/mongoose-cast-error.handler';
import { handleMongoError } from './handler/mongo-error.handler';
import { handleGenericError } from './handler/generic-error.handler';
import { ErrorResponse } from '@poster-parlor-api/shared';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext('HTTP');
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const path = req.url;

    const errorResponse = this.resolveError(exception, path);

    // Build metadata object
    const metadata: Record<string, unknown> = {
      statusCode: errorResponse.statusCode,
      errorCode: errorResponse.error.code,
      path,
      method: req.method,
      timestamp: errorResponse.timestamp,
    };

    // Add development-only information
    if (process.env.NODE_ENV === 'development') {
      if (exception instanceof Error) {
        const stackFrames = parseStackTrace(exception, 3);
        if (stackFrames.length > 0) {
          metadata.trace = stackFrames;
        }
      }

      if (errorResponse.error.details) {
        metadata.details = errorResponse.error.details;
      }

      if (errorResponse.error.validationErrors) {
        metadata.validationErrors = errorResponse.error.validationErrors;
      }
    }

    // Log using errorWithMetadata method
    const logMessage = `${req.method} ${path} - ${errorResponse.statusCode} - ${errorResponse.message}`;

    if (exception instanceof Error) {
      this.logger.errorWithMetadata(logMessage, exception, metadata);
    } else {
      // For non-Error exceptions, create a generic Error
      this.logger.errorWithMetadata(
        logMessage,
        new Error(String(exception)),
        metadata
      );
    }

    res.status(errorResponse.statusCode).json(errorResponse);
  }

  private resolveError(exception: unknown, path: string): ErrorResponse {
    // Check HttpException first (most common)
    if (exception instanceof HttpException) {
      return handleHttpError(exception, path);
    }

    // Check Mongoose-specific errors
    if (exception instanceof MongooseError.ValidationError) {
      return handleMongooseValidationError(exception, path);
    }

    if (exception instanceof MongooseError.CastError) {
      return handleMongooseCastError(exception, path);
    }

    // Check MongoDB driver errors
    if (exception instanceof MongoError) {
      return handleMongoError(exception, path);
    }

    // Generic fallback
    return handleGenericError(exception, path);
  }
}
