import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { UserAdminEntity } from 'src/modules/user/entities';

@Injectable()
export class AdminAuthGuard extends PassportAuthGuard('jwt-admin') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = UserAdminEntity>(
    err: Error,
    user: UserAdminEntity,
  ): TUser {
    if (err || !user) {
      throw (
        err || new UnauthorizedException('message.AUTH.ADMIN_ACCESS_REQUIRED')
      );
    }

    // Check if admin is active
    if (!user.isActive) {
      throw new UnauthorizedException('message.AUTH.ACCOUNT_DISABLED');
    }

    return user as TUser;
  }
}
