import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const PublicOrAuth = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user || null; // Returns user if authenticated, otherwise null
  },
);
