import { TokenTypeEnum } from 'src/auth/enums';
import { RoleEnum } from '../enums';

export interface JwtToken {
  id: string; // User ID
  role: RoleEnum; // User role
  jti: string; // JWT ID (unique identifier for the token)
  type: TokenTypeEnum; // Token type (access or refresh)
  iat?: number; // Issued at timestamp
  exp?: number; // Expiration timestamp
}
