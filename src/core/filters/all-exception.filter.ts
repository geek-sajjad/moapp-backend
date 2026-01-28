/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { ClientException } from '../exceptions';
import { ENVIRONMENTS } from '../enums';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  async catch(exception: any, host: ArgumentsHost) {
    console.log('exception', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Determine status code
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else if (this.isForeignKeyConstraintError(exception)) {
      status = HttpStatus.CONFLICT;
    }

    // Get error message
    const message = this.getMessage(exception);
    console.log('mesag', message);

    const isLocal =
      this.configService.get<ENVIRONMENTS>('NODE_ENV') === ENVIRONMENTS.LOCAL;
    const isHttpException = exception instanceof HttpException;
    const is500 =
      isHttpException &&
      exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR;

    if (isLocal || !isHttpException || is500) {
      if (exception instanceof ClientException) {
        console.error(exception.developerMessage, exception);
      } else {
        console.error('Unhandled Exception:', exception);
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
      timestamp: Date.now(),
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  }

  getMessage(exception: any): string {
    // Handle HttpException or standard Error objects
    if (exception instanceof HttpException) {
      const exceptionResponse: any = exception.getResponse();
      return typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse?.message || 'Internal server error';
    }

    // Check for TypeORM foreign key constraint violations
    if (this.isForeignKeyConstraintError(exception)) {
      return 'Foreign key constraint violation';
    }

    // Handle other exception types (e.g., Twilio errors)
    return exception.message || 'Internal server error';
  }

  private isForeignKeyConstraintError(exception: any): boolean {
    // Check if it's a TypeORM QueryFailedError with foreign key constraint violation
    if (exception?.name === 'QueryFailedError' || exception?.code === '23503') {
      const message = exception?.message || '';
      return (
        message.includes('violates foreign key constraint') ||
        message.includes('foreign key constraint') ||
        message.includes('FK_') ||
        exception?.code === '23503' // PostgreSQL foreign key violation code
      );
    }

    // Check for other database constraint violation patterns
    if (exception?.message) {
      const message = exception.message.toLowerCase();
      return (
        message.includes('foreign key constraint') ||
        message.includes('violates foreign key') ||
        message.includes('cannot delete or update') ||
        message.includes('referenced by a foreign key')
      );
    }

    return false;
  }
}
