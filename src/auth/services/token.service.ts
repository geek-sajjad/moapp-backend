import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { UserPayload } from 'src/core/types';
import { TokenTypeEnum } from '../enums';

@Injectable()
export class TokenService {
  private readonly jwtSecret: string;

  private readonly accessTokenExpiration: string;

  private readonly refreshTokenExpiration: string;

  private readonly temporaryTokenExpiration: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET');
    this.accessTokenExpiration = this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRATION',
    );
    this.refreshTokenExpiration = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION',
    );
    this.temporaryTokenExpiration = this.configService.get<string>(
      'TEMPORARY_TOKEN_EXPIRATION',
    );
  }

  generateAccessToken(id: string): string {
    const jti = uuidv4();
    return this.jwtService.sign(
      { id, jti, type: TokenTypeEnum.ACCESS },
      {
        secret: this.jwtSecret,
        expiresIn: this.accessTokenExpiration as unknown as number,
      },
    );
  }

  generateRefreshToken(sub: string): string {
    const jti = uuidv4();
    return this.jwtService.sign(
      { sub, jti, type: TokenTypeEnum.REFRESH },
      {
        secret: this.jwtSecret,
        expiresIn: this.refreshTokenExpiration as unknown as number,
      },
    );
  }

  generateAdminAccessToken(id: string, email: string): string {
    const jti = uuidv4();
    return this.jwtService.sign(
      { id, jti, type: TokenTypeEnum.ACCESS, email },
      {
        secret: this.jwtSecret,
        expiresIn: this.accessTokenExpiration as unknown as number,
      },
    );
  }

  generateAdminRefreshToken(sub: string): string {
    const jti = uuidv4();
    return this.jwtService.sign(
      { sub, jti, type: TokenTypeEnum.REFRESH },
      {
        secret: this.jwtSecret,
        expiresIn: this.refreshTokenExpiration as unknown as number,
      },
    );
  }

  validateToken(token: string): UserPayload {
    try {
      const options: JwtVerifyOptions = { secret: this.jwtSecret };
      const verified = this.jwtService.verify<{
        id: string;
        jti: string;
        type: TokenTypeEnum;
      }>(token, options);

      if (verified.type === TokenTypeEnum.OTP_TMP_TOKEN) {
        throw new UnauthorizedException({ name: 'JsonWebTokenError' });
      }
      return verified;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('message.AUTH.EXPIRED_TOKEN');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('message.AUTH.INVALID_TOKEN');
      }
      throw new UnauthorizedException('message.AUTH.VERIFICATION_FAILED');
    }
  }

  async rotateRefreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = this.validateToken(refreshToken);

    if (!payload || payload.id !== 'refresh') {
      throw new UnauthorizedException('message.AUTH.INVALID_TOKEN');
    }

    const newAccessToken = this.generateAccessToken(payload.id);
    const newRefreshToken = this.generateRefreshToken(payload.id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  generateTemporaryToken(phoneNumber: string): string {
    const jti = uuidv4();
    return this.jwtService.sign(
      { phoneNumber, jti, type: TokenTypeEnum.OTP_TMP_TOKEN },
      {
        secret: this.jwtSecret,
        expiresIn: this.temporaryTokenExpiration as unknown as number,
      },
    );
  }

  validateTemporaryToken(token: string): UserPayload {
    try {
      const options: JwtVerifyOptions = { secret: this.jwtSecret };
      const verified = this.jwtService.verify<{
        id: string;
        jti: string;
        type: TokenTypeEnum;
      }>(token, options);

      if (verified.type !== TokenTypeEnum.OTP_TMP_TOKEN) {
        throw new UnauthorizedException({ name: 'JsonWebTokenError' });
      }
      return verified;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('message.AUTH.EXPIRED_TOKEN');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('message.AUTH.INVALID_TOKEN');
      }
      throw new UnauthorizedException('message.AUTH.VERIFICATION_FAILED');
    }
  }
}
