import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { RoleEnum } from 'src/core/enums';
import { Reflector } from '@nestjs/core';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Check if request exists
    if (!request) {
      throw new BadRequestException('Invalid request context');
    }

    const { user } = request;

    // Check if user exists and is authenticated
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Check if user has required properties
    if (!user.id || !user.role) {
      throw new BadRequestException('Invalid user data');
    }

    const targetUserId =
      request.body?.userId ||
      request.user?.id ||
      request.params?.userId ||
      request.params?.id;

    console.log('targetUserId', targetUserId);
    // Check if targetUserId exists
    if (!targetUserId) {
      throw new BadRequestException('Target user ID not found in request');
    }

    // Admins always allowed
    if (user.role === RoleEnum.ADMIN) {
      return true;
    }

    // Ensure both IDs are strings for proper comparison
    const userId = String(user.id);
    const targetId = String(targetUserId);

    if (userId !== targetId) {
      throw new ForbiddenException(
        `You can only access your own data. User ID mismatch.`,
      );
    }

    return true;
  }
}
