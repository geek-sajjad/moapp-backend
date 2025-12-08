import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpService } from './otp.service';
import { OtpEntity, OtpAttemptEntity } from './entities';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([OtpEntity, OtpAttemptEntity])],
  controllers: [],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
