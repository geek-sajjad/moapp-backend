import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { FileValidationService } from '../services/file-validation.service';

@Injectable()
export class FileValidationInterceptor<T = unknown>
  implements NestInterceptor<T, T>
{
  constructor(private readonly fileValidationService: FileValidationService) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const request = context.switchToHttp().getRequest<Request>();
    const file = request.file as Express.Multer.File | undefined;

    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Validate file type and size
    this.fileValidationService.validateMimeType(file.mimetype);
    this.fileValidationService.validateFileSize(file.size);

    return next.handle();
  }
}
