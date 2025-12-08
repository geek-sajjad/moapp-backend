/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable import/no-extraneous-dependencies */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import { SmsMessageDto } from './dto/sms-send-message.dto';
import { SmsSendMessageResponseDto } from './dto/sms-send-message-response.dto';

@Injectable()
export class SmsService {
  client: any;

  phone: string;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
    this.client = twilio(accountSid, authToken);
    this.phone = this.configService.get('TWILIO_ACCOUNT_PHONE_NUMBER');
  }

  async sendMessage(
    smsParam: SmsMessageDto,
  ): Promise<SmsSendMessageResponseDto> {
    const result = await this.client.messages.create({
      from: this.phone,
      body: smsParam.message,
      to: smsParam.to,
    });
    return result;
  }
}
