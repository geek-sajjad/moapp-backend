import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { FileValidationService } from '../services';

@Injectable()
export class ImageValidationInterceptor<T = unknown>
  implements NestInterceptor<T, T>
{
  constructor(private readonly fileValidationService: FileValidationService) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const request = context.switchToHttp().getRequest<Request>();
    const file = request.file as Express.Multer.File | undefined;

    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    this.fileValidationService.validateImageSize(file.size);
    return next.handle();
  }
}
