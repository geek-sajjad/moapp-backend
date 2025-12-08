import { ApiProperty } from '@nestjs/swagger';
import { ContactUsStatus } from '../../entities/contact-us.entity';

export class ContactUsResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the contact message',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the person who sent the message',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'The email address of the person who sent the message',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The subject of the contact message',
    example: 'General Inquiry',
  })
  subject: string;

  @ApiProperty({
    description: 'The message content',
    example: 'I would like to know more about your services.',
  })
  message: string;

  @ApiProperty({
    description: 'The status of the contact message',
    enum: ContactUsStatus,
    example: ContactUsStatus.PENDING,
  })
  status: ContactUsStatus;

  @ApiProperty({
    description: 'The response to the contact message',
    example: 'Thank you for your inquiry. We will get back to you soon.',
    nullable: true,
  })
  response: string;

  @ApiProperty({
    description: 'Whether the message has been responded to',
    default: false,
  })
  isResponded: boolean;

  @ApiProperty({
    description: 'The creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The last update timestamp',
  })
  updatedAt: Date;
}
