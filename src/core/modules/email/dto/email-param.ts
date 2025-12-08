/* eslint-disable @typescript-eslint/no-explicit-any */
import { Language } from 'src/core/enums';
import { ApiProperty } from '@nestjs/swagger';
import { EmailTypes } from '../enums';

export class EmailParams {
  @ApiProperty({ type: [String], description: 'List of emails' })
  mailingList: string[];

  @ApiProperty({ enum: EmailTypes })
  emailType: EmailTypes;

  @ApiProperty({ type: Object, required: false })
  templateVariables?: Record<string, any>;

  @ApiProperty({ enum: Language, required: false })
  preferredLanguage?: Language;
}
