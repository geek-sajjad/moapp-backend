import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export class FirebaseDto {
  @ApiProperty({
    description: 'Target device token to send the notification',
    example: 'fcm_device_token_example_123',
  })
  @IsString()
  token: string; // Target device token

  @ApiPropertyOptional({
    description: 'Notification payload containing the title and body',
    example: {
      title: 'Hello World',
      body: 'This is a test notification',
    },
  })
  @IsObject()
  @IsOptional()
  notification?: {
    title: string;
    body: string;
  }; // Notification payload (optional)

  @ApiPropertyOptional({
    description: 'Custom key-value pairs to send additional information',
    example: {
      key1: 'value1',
      key2: 'value2',
    },
  })
  @IsObject()
  @IsOptional()
  data?: Record<string, string>; // Custom data (optional)
}
