// src/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { EmailService } from '../email/email.service';
import { FirebaseMessageParams } from '../firebase/interface';
import { SmsService } from '../sms/sms.service';
import { WhatsappMessageDto } from '../whatsapp/dto/whatsapp-message.dto';
import { SmsSendMessageResponseDto } from '../sms/dto/sms-send-message-response.dto';
import { EmailParams } from '../email/dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

  async sendMessageByFirebase(messageParam: FirebaseMessageParams) {
    return this.firebaseService.sendMessage(messageParam);
  }

  async sendeEmail(emailParams: EmailParams) {
    return this.emailService.sendTemplateEmail(emailParams);
  }

  async sendMessageBySMS(
    param: WhatsappMessageDto,
  ): Promise<SmsSendMessageResponseDto> {
    return this.smsService.sendMessage(param);
  }
}
