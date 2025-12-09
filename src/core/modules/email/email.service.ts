import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MailtrapClient } from 'mailtrap';

import { Language } from 'src/core/enums/';
import { ClientException } from 'src/core/exceptions';
import { EmailTemplates } from './constants';
import { EmailDto } from './dto/email-dto';
import { EmailSender } from './interfaces/email-sender.interface';
import { EmailParams } from './dto';

@Injectable()
export class EmailService {
  private mailTrapClient: MailtrapClient;

  private from: EmailSender;

  // private fromGmail: EmailSender;

  // private transporter;

  constructor(private readonly configService: ConfigService) {
    const mailtrapToken = this.configService.get<string>('MAILTRAP_TOKEN');
    if (!mailtrapToken) {
      throw new Error('MAILTRAP_TOKEN is not defined in the configuration');
    }

    this.mailTrapClient = new MailtrapClient({ token: mailtrapToken });
    this.from = {
      email: this.configService.get<string>('EMAIL_SENDER_ADDRESS'),
      name: this.configService.get<string>('EMAIL_SENDER_Name'),
    };
    // this.fromGmail = {
    //   email: this.configService.get<string>('GMAIL_SENDER_ADDRESS'),
    //   name: this.configService.get<string>('GMAIL_SENDER_Name'),
    // };
  }

  // private initializeTransporter() {
  //   this.transporter = nodemailer.createTransport({
  //     host:
  //       this.configService.get<string>('SMTP_HOST') ||
  //       'sandbox.smtp.mailtrap.io',
  //     port: this.configService.get<number>('SMTP_PORT') || 2525,
  //     auth: {
  //       user: this.configService.get<string>('MAILTRAP_USER'),
  //       pass: this.configService.get<string>('MAILTRAP_PASS'),
  //     },
  //   });
  // }

  // async sendGmailEmail(params: EmailDto): Promise<void> {
  //   if (!this.transporter) {
  //     this.initializeTransporter();
  //   }

  //   const mailOptions = {
  //     from: this.fromGmail,
  //     to: params.email,
  //     subject: params.subject,
  //     text: params.text || undefined,
  //     html: !params.text ? params.html : undefined,
  //   };

  //   try {
  //     await this.transporter.sendMail(mailOptions);
  //   } catch (error) {
  //     throw new ClientException('message.EMAIL.FAILD_SENDING', error.message);
  //   }
  // }

  async sendEmail(params: EmailDto): Promise<void> {
    const mailOptions = {
      from: this.from,
      to: [
        {
          email: params.email,
        },
      ],
      subject: params.subject,
      text: params.text || undefined,
      html: !params.text ? params.html : undefined,
    };

    try {
      await this.mailTrapClient.send(mailOptions);
    } catch (error) {
      console.log(error);
      throw new ClientException(`message.EMAIL.FAILD_SENDING`, error.message);
    }
  }

  async sendTemplateEmail(emailParams: EmailParams): Promise<void> {
    const {
      mailingList,
      emailType,
      templateVariables,
      preferredLanguage = Language.ENGLISH,
    } = emailParams;

    const to = mailingList.map((email) => ({
      email,
    }));

    const mailOptions = {
      from: this.from,
      to,
      template_uuid: EmailTemplates[emailType][preferredLanguage],
      template_variables: templateVariables,
    };

    try {
      await this.mailTrapClient.send(mailOptions);
    } catch (error) {
      throw new HttpException(`message.EMAIL.FAILD_SENDING`, 400);
    }
  }
}
