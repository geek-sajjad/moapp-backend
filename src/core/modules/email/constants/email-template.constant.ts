import { EmailTemplateEntry } from '../dto';
import { EmailTypes } from '../enums';

export const EmailTemplates: Record<EmailTypes, EmailTemplateEntry> = {
  [EmailTypes.CLIENT_OTP_VERIFICATION]: {
    en: 'Valid uuid shold be taken from mailTrap',
    ar: 'Valid uuid shold be taken from mailTrap',
  },
  [EmailTypes.CLIENT_SUBSCRIPTION_CONFIRMATION]: {
    en: 'Valid uuid shold be taken from mailTrap',
    ar: 'Valid uuid shold be taken from mailTrap',
  },
  [EmailTypes.CLIENT_REFERRAL]: {
    en: 'Valid uuid shold be taken from mailTrap',
    ar: 'Valid uuid shold be taken from mailTrap',
  },
  [EmailTypes.CLIENT_SUBSCRIPTION_REMINDER]: {
    en: 'Valid uuid shold be taken from mailTrap',
    ar: 'Valid uuid shold be taken from mailTrap',
  },
  [EmailTypes.CLIENT_RENEW_SUBSCRIPTION]: {
    en: 'Valid uuid shold be taken from mailTrap',
    ar: 'Valid uuid shold be taken from mailTrap',
  },
  [EmailTypes.CLIENT_EMAIL_VERIFICATION]: {
    en: 'Valid uuid shold be taken from mailTrap',
    ar: 'Valid uuid shold be taken from mailTrap',
  },
  [EmailTypes.CLIENT_TRIAL_SUBSCRIPTION_CONFIRMATION]: {
    en: 'Valid uuid shold be taken from mailTrap',
    ar: 'Valid uuid shold be taken from mailTrap',
  },
};
