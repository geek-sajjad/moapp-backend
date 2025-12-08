import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ContactUsStatus } from '../../entities/contact-us.entity';

export class UpdateContactStatusDto {
  @ApiProperty({
    description: 'The new status of the contact message',
    enum: ContactUsStatus,
    example: ContactUsStatus.IN_PROGRESS,
  })
  @IsEnum(ContactUsStatus, { message: 'validation.IS_ENUM' })
  status: ContactUsStatus;
}
