// src/pipes/validate-object-id.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform<string> {
  private readonly objectIdRegex = /^[a-fA-F0-9]{24}$/;

  transform(value: string): string {
    if (!this.isValidObjectId(value)) {
      throw new BadRequestException(`Invalid ID format: ${value}`);
    }
    return value;
  }

  private isValidObjectId(id: string): boolean {
    return this.objectIdRegex.test(id);
  }
}
