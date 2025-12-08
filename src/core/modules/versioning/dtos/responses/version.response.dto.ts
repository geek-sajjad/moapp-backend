import { ApiProperty } from '@nestjs/swagger';
import * as moment from 'moment';
import { VersionEntity } from '../../entities';

export class VersionResponseDto {
  @ApiProperty({ description: 'Version number', example: '1.1.0' })
  version: string = '1.0.0';

  @ApiProperty({
    description: 'Indicates if a forced update is required',
    example: false,
  })
  forceUpdate: boolean = false;

  @ApiProperty({
    description: 'Timestamp for the version version',
    example: '2024-01-01T12:00:00Z',
  })
  releaseDate: Date = null; // or Date depending on your storage format

  @ApiProperty({
    description: 'Timestamp when the version was added',
    example: '2024-01-01 12:00:00Z',
  })
  createdAt: string = null;

  constructor(partial?: VersionEntity) {
    if (partial) {
      this.version = partial.version;
      this.forceUpdate = partial.forceUpdate;
      this.releaseDate = partial.releaseDate; // Default to current timestamp
      this.createdAt = moment(partial.createdAt).format('YYYY-MM-DD HH:mm:ss');
    }
  }
}
