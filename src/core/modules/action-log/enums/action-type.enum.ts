export enum ActionCategory {
  AUTH = 'AUTH',
  USER = 'USER',
  PRODUCT = 'PRODUCT',
  PAYMENT = 'PAYMENT',
}

export enum ActionType {
  // Auth actions
  LOGIN = 'AUTH.LOGIN',
  LOGOUT = 'AUTH.LOGOUT',
  REGISTER = 'AUTH.REGISTER',
  PASSWORD_RESET = 'AUTH.PASSWORD_RESET',
  PASSWORD_CHANGE = 'AUTH.PASSWORD_CHANGE',
  TOKEN_REFRESH = 'AUTH.TOKEN_REFRESH',

  // User actions
  PROFILE_VIEW = 'USER.PROFILE_VIEW',
  PROFILE_UPDATE = 'USER.PROFILE_UPDATE',
  ME_ENDPOINT_ACCESS = 'USER.ME_ENDPOINT_ACCESS',

  // Product actions
  PRODUCT_VIEW = 'PRODUCT.VIEW',
  PRODUCT_SEARCH = 'PRODUCT.SEARCH',
  PRODUCT_FILTER = 'PRODUCT.FILTER',

  // Payment actions
  PAYMENT_INITIATE = 'PAYMENT.INITIATE',
  PAYMENT_SUCCESS = 'PAYMENT.SUCCESS',
  PAYMENT_FAIL = 'PAYMENT.FAIL',
  PAYMENT_REFUND = 'PAYMENT.REFUND',
}

export const getActionCategory = (actionType: ActionType): ActionCategory => {
  const [category] = actionType.split('.');
  return category as ActionCategory;
};

export const getActionsByCategory = (category: ActionCategory): ActionType[] =>
  Object.values(ActionType).filter(
    (action) => getActionCategory(action) === category,
  );
