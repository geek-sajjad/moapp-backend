import { applyDecorators, UseInterceptors, Type } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SingleFileUploadDto } from '../dtos/requests';

export const SingleFileUploadDecorator = (
  dtoClass: Type<unknown> = SingleFileUploadDto,
  fieldName: string = 'image',
) =>
  applyDecorators(
    ApiConsumes('multipart/form-data'),
    UseInterceptors(FileInterceptor(fieldName)),
    ApiBody({
      description: `Upload a single file for field ${fieldName}`,
      type: dtoClass,
    }),
  );
