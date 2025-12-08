import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  logger = new Logger('Backend System');

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const total = Date.now() - now;
        const logObject: {
          Method: string;
          URL: string;
          total: string;
          body?: string;
          query?: string;
        } = {
          Method: req.method,
          URL: req.originalUrl,
          total: `${total} ms`,
        };
        if (req.method !== 'GET' && req.body) logObject.body = req.body;
        if (Object.keys(req.query).length > 0) logObject.query = req.query;
        if (req.originalUrl !== '/') this.logger.log(JSON.stringify(logObject));
      }),
      catchError((error) => {
        const total = Date.now() - now;
        const logObject = {
          Method: req.method,
          URL: req.originalUrl,
          total: `${total} ms`,
          error: error.message || 'Unknown error',
          body: '',
          query: '',
        };
        if (req.method !== 'GET' && req.body) logObject.body = req.body;
        if (Object.keys(req.query).length > 0) logObject.query = req.query;
        this.logger.error(JSON.stringify(logObject));
        return throwError(() => error);
      }),
    );
  }
}
