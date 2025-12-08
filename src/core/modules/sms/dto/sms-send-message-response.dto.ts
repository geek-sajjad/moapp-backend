import { ApiProperty } from '@nestjs/swagger';

export class SmsSendMessageResponseDto {
  @ApiProperty({
    description: 'The SID of the account that sent the message.',
    example: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  })
  account_sid: string;

  @ApiProperty({
    description: 'The version of the Twilio API used.',
    example: '2010-04-01',
  })
  api_version: string;

  @ApiProperty({
    description: 'The message body.',
    example: 'Sent from your Twilio trial account - fdsff',
  })
  body: string;

  @ApiProperty({
    description: 'The date when the message was created.',
    example: 'Fri, 24 Jan 2025 11:54:27 +0000',
  })
  date_created: string;

  @ApiProperty({
    description: 'The date when the message was sent.',
    example: null,
  })
  date_sent: string | null;

  @ApiProperty({
    description: 'The date when the message was last updated.',
    example: 'Fri, 24 Jan 2025 11:54:27 +0000',
  })
  date_updated: string;

  @ApiProperty({
    description: 'The direction of the message.',
    example: 'outbound-api',
  })
  direction: string;

  @ApiProperty({
    description: 'The error code if the message failed.',
    example: null,
  })
  error_code: string | null;

  @ApiProperty({
    description: 'The error message if the message failed.',
    example: null,
  })
  error_message: string | null;

  @ApiProperty({
    description: 'The sender phone number.',
    example: '+15677042605',
  })
  from: string;

  @ApiProperty({
    description: 'The SID of the messaging service.',
    example: null,
  })
  messaging_service_sid: string | null;

  @ApiProperty({
    description: 'The number of media files attached to the message.',
    example: '0',
  })
  num_media: string;

  @ApiProperty({
    description: 'The number of segments in the message.',
    example: '1',
  })
  num_segments: string;

  @ApiProperty({
    description: 'The price of sending the message.',
    example: null,
  })
  price: string | null;

  @ApiProperty({
    description: 'The currency of the price.',
    example: 'USD',
  })
  price_unit: string;

  @ApiProperty({
    description: 'The SID of the message.',
    example: 'SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  })
  sid: string;

  @ApiProperty({
    description: 'The status of the message.',
    example: 'queued',
  })
  status: string;

  @ApiProperty({
    description: 'Subresource URIs related to the message.',
    example: {
      media:
        '/2010-04-01/Accounts/ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/Messages/SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/Media.json',
    },
  })
  subresource_uris: {
    media: string;
  };

  @ApiProperty({
    description: 'The recipient phone number.',
    example: '+15551234567',
  })
  to: string;

  @ApiProperty({
    description: 'The URI path for the resource.',
    example:
      '/2010-04-01/Accounts/ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/Messages/SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.json',
  })
  uri: string;
}
