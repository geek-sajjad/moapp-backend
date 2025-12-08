import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from 'src/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { configJWT } from 'src/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OtpModule } from 'src/core/modules/otp/otp.module';
import { ActionLogModule } from 'src/core/modules/action-log/action-log.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TokenService } from './services/token.service';
import { AdminAuthService } from './services';
import { AdminAuthController } from './controllers';
import { JwtStrategy } from './strategies/jwt.strategy';

@Global()
@Module({
  imports: [
    UserModule,
    OtpModule,
    ActionLogModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configJWT(configService),
    }),
  ],
  controllers: [AuthController, AdminAuthController],
  providers: [AuthService, TokenService, AdminAuthService, JwtStrategy],
  exports: [JwtModule, AuthService, PassportModule],
})
export class AuthModule {}
