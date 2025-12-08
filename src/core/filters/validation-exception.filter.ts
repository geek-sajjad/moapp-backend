import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import * as moment from 'moment';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = HttpStatus.BAD_REQUEST;

    const exceptionResponse = exception.getResponse();
    let errors: string[] = [];

    // Safely extract error messages if the response has them
    if (
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      errors = Array.isArray(exceptionResponse.message)
        ? exceptionResponse.message
        : [exceptionResponse.message];
    }

    response.status(statusCode).json({
      statusCode,
      errors,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  }
}
