import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/auth/decorators';
import { TokenTypeEnum } from 'src/auth/enums';
import { JwtToken } from '../interfaces';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true; // Allow access if route is marked public
    }
    return super.canActivate(context);
  }

  handleRequest<TUser = JwtToken>(
    err: Error,
    user: JwtToken,
    _info: unknown,
    _context: ExecutionContext,
  ): TUser {
    // Handle JWT strategy validation errors
    if (err || !user) {
      throw err || new UnauthorizedException('message.AUTH.INVALID_TOKEN');
    }

    // Additional validation for token type
    if (user.type === TokenTypeEnum.OTP_TMP_TOKEN) {
      throw new UnauthorizedException('message.AUTH.TEMPORARY_TOKEN');
    }

    // The JWT strategy already validates user existence and active status
    // So we can directly return the user
    return user as TUser;
  }
}
