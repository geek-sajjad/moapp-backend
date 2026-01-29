import { ConfigService } from '@nestjs/config';

export const configJWT = (configService: ConfigService) => ({
  secret: configService.getOrThrow<string>('JWT_SECRET'),
  signOptions: {
    expiresIn: configService.getOrThrow<string>(
      'ACCESS_TOKEN_EXPIRATION',
    ) as unknown as number,
  },
});
