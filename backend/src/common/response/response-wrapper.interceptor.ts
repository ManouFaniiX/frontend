import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { ApiResponse } from './response.interface';

@Injectable()
export class ResponseWrapperInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data: T) => {
        const isPaginated =
          data &&
          typeof data === 'object' &&
          !Array.isArray(data) &&
          'items' in (data as Record<string, unknown>) &&
          Array.isArray((data as Record<string, unknown>).items) &&
          'total' in (data as Record<string, unknown>);

        if (isPaginated) {
          const p = data as unknown as {
            items: unknown[];
            total: number;
            page: number;
            limit: number;
          };
          return {
            success: true,
            code: response.statusCode,
            message: '',
            meta: {
              length: p.items.length,
              total: p.total,
              page: p.page,
              limit: p.limit,
            },
            data: p.items,
          } as unknown as ApiResponse<T>;
        }

        return {
          success: true,
          code: response.statusCode,
          message: '',
          meta: null,
          data,
        };
      }),
    );
  }
}
