import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configJWT } from 'src/config';
import { AdminPayload } from 'src/core/types';
import { AdminService } from 'src/modules/user/services';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(
    private readonly adminService: AdminService,
    configService: ConfigService,
  ) {
    const { secret: secretOrKey } = configJWT(configService);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  async validate(payload: AdminPayload) {
    // Validate that this is an admin token
    const adminInfo = await this.adminService.findAdminById(payload.id);

    if (!adminInfo) {
      throw new UnauthorizedException('message.AUTH.INVALID_TOKEN');
    }

    // Check if admin is active
    if (!adminInfo.isActive) {
      throw new UnauthorizedException('message.AUTH.ACCOUNT_DISABLED');
    }

    return adminInfo;
  }
}
