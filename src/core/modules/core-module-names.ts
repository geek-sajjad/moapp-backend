import { AuthModule } from 'src/auth/auth.module';
import { NotificationModule } from 'src/core/modules/notification/notification.module';
import { FirebaseModule } from 'src/core/modules/firebase/firebase.module';
import { EmailModule } from 'src/core/modules/email/email.module';
import { PaymentModule } from 'src/core/modules/payment/payment.module';
import { WhatsappModule } from 'src/core/modules/whatsapp/whatsapp.module';
import { VersioningModule } from 'src/core/modules/versioning/versioning.module';
import { ImageModule } from 'src/core/modules/image/image.module';
import { S3Module } from 'src/core/modules/s3/s3.module';
import { PipesModule } from 'src/core/pipes/pipes.module';
import { HealthModule } from './health/health.module';
import { OtpModule } from './otp/otp.module';
import { SmsModule } from './sms/sms.module';
import { ActionLogModule } from './action-log/action-log.module';
import { FileModule } from './file/file.module';
import { MappingModule } from '../mapping-profiles/mapping.module';

export const LIST_OF_CORE_MODULES = [
  FirebaseModule,
  SmsModule,
  EmailModule,
  OtpModule,
  HealthModule,
  AuthModule,
  NotificationModule,
  WhatsappModule,
  PaymentModule,
  VersioningModule,
  ImageModule,
  S3Module,
  ActionLogModule,
  FileModule,
  PipesModule,
  MappingModule,
];
