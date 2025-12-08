import { ApiProperty } from '@nestjs/swagger';

export class SingleFileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' }) // This tells Swagger it's a file
  image: Express.Multer.File;
}
