import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_ACTIVE_SUBSCRIPTION_KEY } from '../decorators/require-active-subscription.decorator';
import { UserPayload } from '../types';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if the route requires an active subscription
    const requiresActiveSubscription =
      this.reflector.getAllAndOverride<boolean>(
        REQUIRE_ACTIVE_SUBSCRIPTION_KEY,
        [context.getHandler(), context.getClass()],
      );

    // If the route doesn't require active subscription, allow access
    if (!requiresActiveSubscription) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserPayload = request.user;

    // Check if user exists
    if (!user) {
      throw new ForbiddenException('message.AUTH.USER_NOT_FOUND');
    }

    // Check if user has a subscription end date
    if (!user.subscriptionEndDate) {
      throw new ForbiddenException('message.SUBSCRIPTION.NO_SUBSCRIPTION');
    }

    // Check if subscription is still active
    const now = new Date();
    const subscriptionEnd = new Date(user.subscriptionEndDate);

    if (now > subscriptionEnd) {
      throw new ForbiddenException('message.SUBSCRIPTION.EXPIRED');
    }

    return true;
  }
}
