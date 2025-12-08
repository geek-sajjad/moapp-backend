export const Order = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;
export type Order = (typeof Order)[keyof typeof Order];
