export const Language = {
  ARABIC: 'ar',
  ENGLISH: 'en',
  FRENCH: 'fr',
  SPANISH: 'es',
} as const;
export type Language = (typeof Language)[keyof typeof Language];
