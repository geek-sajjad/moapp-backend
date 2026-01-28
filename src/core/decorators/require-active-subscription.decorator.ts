import { SetMetadata } from '@nestjs/common';

export const REQUIRE_ACTIVE_SUBSCRIPTION_KEY = 'requireActiveSubscription';

/**
 * Decorator to mark routes that require an active subscription
 * When applied, the route will be blocked if the user's subscription has expired
 */
export const RequireActiveSubscription = () =>
  SetMetadata(REQUIRE_ACTIVE_SUBSCRIPTION_KEY, true);
