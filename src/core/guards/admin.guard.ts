// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { ADMIN_KEY } from '../decorators/admin.decorator';

// @Injectable()
// export class AdminGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const requiresAdmin = this.reflector.getAllAndOverride<string[]>(
//       ADMIN_KEY,
//       [context.getHandler(), context.getClass()],
//     );

//     if (!requiresAdmin) {
//       return true;
//     }

//     const request = context.switchToHttp().getRequest();
//     const { user } = request;

//     // Check if user exists and is an admin
//     if (!user || !user.isAdmin) {
//       throw new ForbiddenException('message.AUTH.ADMIN_ACCESS_REQUIRED');
//     }

//     return true;
//   }
// }
