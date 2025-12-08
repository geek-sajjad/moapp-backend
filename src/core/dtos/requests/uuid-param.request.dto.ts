import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ParamAsUUID {
  @IsUUID('4', { message: 'validation.INVALID_UUID' }) // Custom message
  @ApiProperty({ description: 'UUID ' })
  id: string;
}
