import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configJWT } from 'src/config';
import { UserPayload } from 'src/core/types';
import { UserService } from 'src/modules/user/services';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    const { secret: secretOrKey } = configJWT(new ConfigService());
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey, // Load from env
    });
  }

  async validate(payload: UserPayload) {
    const userInfo = await this.userService.findUser({ id: payload.id });
    // Check if user account is active
    if (!userInfo.isActive) {
      throw new UnauthorizedException('message.AUTH.USER.ACCOUNT_INACTIVE');
    }

    return userInfo;
  }
}
