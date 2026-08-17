import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSuccessResponse } from '../types/response.type';
import { PaginationMeta } from '../types/pagination.type';

interface PaginatedPayload<T> {
  data: T;
  meta: PaginationMeta;
}

function isPaginatedPayload<T>(value: unknown): value is PaginatedPayload<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    'meta' in value
  );
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiSuccessResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponse<T>> {
    return next.handle().pipe(
      map((result) => {
        if (isPaginatedPayload<T>(result)) {
          return { success: true, data: result.data, meta: result.meta };
        }
        return { success: true, data: result as T };
      }),
    );
  }
}
