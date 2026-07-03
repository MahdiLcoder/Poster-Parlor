/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppLogger } from '@poster-parlor-api/logger';
import { Request, Response } from 'express';
import { SuccessResponse } from '@poster-parlor-api/shared';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>>
{
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext('HTTP');
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<SuccessResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'unknown';
    const user = (request as any).user;

    const controller = context.getClass().name;
    const handler = context.getHandler().name;
    const startTime = Date.now();

    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode;
        const duration = Date.now() - startTime;

        // Check if response is already wrapped (has success, data, and is an ApiResponse structure)
        const isAlreadyWrapped =
          data &&
          typeof data === 'object' &&
          'success' in data &&
          'statusCode' in data &&
          'timestamp' in data;

        // If already wrapped, just pass through
        if (isAlreadyWrapped) {
          // Update path and timestamp if needed
          data.path = data.path || url;
          data.timestamp = data.timestamp || new Date().toISOString();

          // Log successful requests
          this.logger.logWithMetadata(
            `✓ ${method} ${url} ${statusCode} - ${duration}ms`,
            {
              method,
              url,
              statusCode,
              duration: `${duration}ms`,
              userId: user?.id || user?.sub,
              ip: (headers['x-forwarded-for'] as string) || ip,
              userAgent,
              controller,
              handler,
            }
          );

          return data;
        }

        // Build success response for unwrapped data
        const successResponse: SuccessResponse<T> = {
          success: true,
          message: 'Request successful',
          data: data,
          timestamp: new Date().toISOString(),
          path: url,
        };

        // Log successful requests
        this.logger.logWithMetadata(
          `✓ ${method} ${url} ${statusCode} - ${duration}ms`,
          {
            method,
            url,
            statusCode,
            duration: `${duration}ms`,
            userId: user?.id || user?.sub,
            ip: (headers['x-forwarded-for'] as string) || ip,
            userAgent,
            controller,
            handler,
          }
        );

        return successResponse;
      }),
      tap({
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

          // Log failed requests (errors are handled by exception filter)
          this.logger.logWithMetadata(
            `✗ ${method} ${url} ${statusCode} - ${duration}ms`,
            {
              method,
              url,
              statusCode,
              duration: `${duration}ms`,
              userId: user?.id || user?.sub,
              ip: (headers['x-forwarded-for'] as string) || ip,
              controller,
              handler,
              error: error?.message,
            }
          );
        },
      })
    );
  }
}
