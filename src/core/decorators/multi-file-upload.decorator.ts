import { applyDecorators, Type, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

export const MultiFileUploadDecorator = (
  dtoClass: Type<unknown>,
  fields: { name: string; maxCount: number }[],
) =>
  applyDecorators(
    ApiConsumes('multipart/form-data'),
    UseInterceptors(FileFieldsInterceptor(fields)),
    ApiBody({
      description: `Upload multiple files: ${fields
        .map((f) => `${f.name} (max: ${f.maxCount})`)
        .join(', ')}`,
      type: dtoClass,
    }),
  );
