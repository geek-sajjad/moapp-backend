import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from 'src/core/types';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UserPayload | null => {
    const request = context.switchToHttp().getRequest();
    return (request.user as UserPayload) || null; // Cast `request.user` to `UserPayload` type
  },
);
