import { ENVIRONMENTS } from '../enums';

export function isProduction() {
  return process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION;
}

export function isLocal() {
  return process.env.NODE_ENV === ENVIRONMENTS.LOCAL;
}

export function isStaging() {
  return process.env.NODE_ENV === ENVIRONMENTS.STAGING;
}
