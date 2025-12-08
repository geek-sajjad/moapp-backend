/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestUtil } from 'src/core/utilities/request.util';
import { WhatsappMessageDto, WhatsappSendMessageResponseDto } from './dto';

@Injectable()
export class WhatsappService {
  private readonly apiUrl;

  private readonly defaultHeader;

  private readonly accessToken: string;

  private readonly phoneNumberId: string;

  constructor(
    private readonly reqUtil: RequestUtil,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.getOrThrow('WHATSAPP_API_URL');
    this.accessToken = this.configService.getOrThrow(
      'WHATSAPP_API_ACCESS_TOKEN',
    );
    this.phoneNumberId = this.configService.getOrThrow(
      'WHATSAPP_PHONE_NUMBER_ID',
    );
    this.defaultHeader = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  async sendMessage(
    param: WhatsappMessageDto,
  ): Promise<WhatsappSendMessageResponseDto> {
    const url = `${this.apiUrl}/${this.phoneNumberId}/messages`;

    const body = {
      messaging_product: 'whatsapp',
      to: param.to,
      type: 'text',
      text: {
        body: param.message,
      },
    };

    return this.reqUtil.post(url, body, this.defaultHeader);
  }
}
