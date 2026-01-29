import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from 'src/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { configJWT } from 'src/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ActionLogModule } from 'src/core/modules/action-log/action-log.module';
import { AuthService } from './services/auth.service';
import { AuthController, AdminAuthController } from './controllers';
import { TokenService } from './services/token.service';
import { JwtStrategy, JwtAdminStrategy } from './strategies';

@Global()
@Module({
  imports: [
    UserModule,
    ActionLogModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configJWT(configService),
    }),
  ],
  controllers: [AuthController, AdminAuthController],
  providers: [AuthService, TokenService, JwtStrategy, JwtAdminStrategy],
  exports: [JwtModule, AuthService, PassportModule],
})
export class AuthModule {}
