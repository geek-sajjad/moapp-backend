import {
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/services';
import * as bcrypt from 'bcrypt';
import { ENVIRONMENTS, RoleEnum } from 'src/core/enums';
import { EmailService } from 'src/core/modules/email/email.service';
import { ConfigService } from '@nestjs/config';
import {
  AdminLoginDto,
  // AdminRegisterDto,
  AdminResetPasswordDto,
} from '../dtos/requests';
import { TokenService } from './token.service';
import {
  AdminLoginResponseDto,
  // AdminRegisterResponseDto,
} from '../dtos/responses';

@Injectable()
export class AdminAuthService {
  private readonly logger = new Logger(AdminAuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  // async register(adminRegisterDto: AdminRegisterDto) {
  //   const { email, password, fullName } = adminRegisterDto;
  //   const user = await this.userService.findByEmail(email);
  //   if (user) {
  //     throw new HttpException('message.AUTH.USER.ALREADY_EXISTS', 400);
  //   }

  //   const newUser = await this.userService.createAdminUser({
  //     email,
  //     password,
  //     fullName,
  //   });
  //   return new AdminRegisterResponseDto(fullName, email, newUser.id);
  // }

  async getCurrentUser(userId: string) {
    const userInfo = await this.userService.findUser({ id: userId });
    return userInfo;
  }

  async login(adminLoginDto: AdminLoginDto): Promise<AdminLoginResponseDto> {
    const { email, password } = adminLoginDto;

    // Fetch user by email
    const user = await this.userService.findByEmail(email);

    // Validate user existence and role
    if (!user || user.role === RoleEnum.USER) {
      throw new UnauthorizedException(
        'message.AUTH.USER.INVALID_EMAIL_OR_PASSWORD',
      );
    }

    // Verify password match
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'message.AUTH.USER.INVALID_EMAIL_OR_PASSWORD',
      );
    }

    // Check if user account is active
    if (!user.isActive) {
      throw new UnauthorizedException('message.AUTH.USER.ACCOUNT_INACTIVE');
    }

    // Generate tokens
    const accessToken = this.tokenService.generateAccessToken(
      user.id,
      user.role,
    );
    const refreshToken = this.tokenService.generateRefreshToken(
      user.id,
      user.role,
    );

    // Return response DTO
    return new AdminLoginResponseDto(
      user.id,
      accessToken,
      refreshToken,
      user.role,
    );
  }

  async forgotPassword(email: string): Promise<void> {
    const isLocalOrDevelopmentEnv =
      this.configService.get('NODE_ENV') === ENVIRONMENTS.LOCAL ||
      this.configService.get('NODE_ENV') === ENVIRONMENTS.DEVELOPMENT;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('message.USER.NOT_FOUND', 400);
    }

    // Check if user account is active
    if (!user.isActive) {
      throw new UnauthorizedException('message.AUTH.USER.ACCOUNT_INACTIVE');
    }

    // Generate encrypted token using JWT for security
    // This is better than a simple numeric token because:
    // 1. It contains encrypted user data that can be verified
    // 2. Has built-in expiration
    // 3. Cannot be guessed or brute-forced like numeric tokens
    // 4. Can be validated on the server side
    // TODO: generate reset token type
    const token = this.tokenService.generateAccessToken(user.id, user.role);

    const resetPasswordLink = `${this.configService.get('FRONTEND_URL')}/en/reset-password?email=${email}&token=${token}`;

    if (isLocalOrDevelopmentEnv) {
      this.logger.log('reset password Link:', resetPasswordLink);
    }
    const FORGOT_PASSWORD_EMAIL_IS_ACTIVE =
      this.configService.get<string>('FORGOT_PASSWORD_EMAIL_IS_ACTIVE') ===
      'true';

    if (FORGOT_PASSWORD_EMAIL_IS_ACTIVE) {
      await this.emailService.sendEmail({
        email,
        subject: 'Password Reset',
        html: `<p>Please click the link below to reset your password:</p>
             <a href="${resetPasswordLink}">Reset Password</a>`,
      });
    }
  }

  async resetPassword(
    resetPasswordDto: AdminResetPasswordDto,
  ): Promise<boolean> {
    const { email, password, confirmPassword } = resetPasswordDto;

    const verifiedToken = this.tokenService.validateToken(
      resetPasswordDto.token,
    );
    if (!verifiedToken) {
      throw new HttpException('message.AUTH.INVALID_TOKEN', 400);
    }

    // Validate password and confirm password
    if (password !== confirmPassword) {
      throw new HttpException('message.AUTH.PASSWORD_MISMATCH', 400);
    }

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('message.AUTH.USER_NOT_FOUND', 400);
    }

    // Check if user account is active
    if (!user.isActive) {
      throw new UnauthorizedException('message.AUTH.USER.ACCOUNT_INACTIVE');
    }

    // Update user password
    await this.userService.update(user.id, { password });
    return true;
  }
}
