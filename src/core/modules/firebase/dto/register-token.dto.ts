import { ApiProperty } from '@nestjs/swagger';

export class FirebaseRegisterTokenDto {
  @ApiProperty({
    description: 'The identifier of the device',
    example: '',
  })
  identifier: string;

  @ApiProperty({
    description: 'The token of the device',
    example: '',
  })
  token: string;
}
