import {
  HttpException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ENVIRONMENTS, RoleEnum } from 'src/core/enums';
import { UserService } from 'src/modules/user/services';
import { OtpService } from 'src/core/modules/otp/otp.service';
import { OtpMedium } from 'src/core/modules/otp/enums';
import { EmailService } from 'src/core/modules/email/email.service';
import { isProduction } from 'src/core/utilities';
import { SmsService } from 'src/core/modules/sms/sms.service';
import { I18nService } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import {
  AuthSignupDto,
  VerifyOtpDto,
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../dtos/requests';
import {
  VerifyOtpResponseDto,
  RefreshTokenResponseDto,
  AuthSignupResponseDto,
  LoginResponseDto,
  RegisterResponseDto,
  ForgotPasswordResponseDto,
  ResetPasswordResponseDto,
} from '../dtos/responses';
import { SendOtpDto } from '../dtos/requests/send-otp.dto';
import { SendOtpResponseDto } from '../dtos/responses/send-otp.response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly smsService: SmsService,
    private readonly i18nService: I18nService,
  ) {}

  async sendOtp(
    sendOtpDto: SendOtpDto,
    otpMedium: OtpMedium,
  ): Promise<SendOtpResponseDto> {
    const { phoneNumber } = sendOtpDto;
    const otpInfo = await this.otpService.generateOtp(phoneNumber);

    // we send sms and email just in production and we should change it based on requiredment
    if (isProduction()) {
      if (otpMedium === OtpMedium.EMAIL) {
        this.emailService.sendEmail({
          email: '',
          subject: '',
          text: '',
        });
      } else if (otpMedium === OtpMedium.SMS) {
        this.smsService.sendMessage({
          message: this.i18nService.translate('message.AUTH.OTP.CODE', {
            args: { property: otpInfo.otp },
          }),
          to: phoneNumber,
        });
      }
    } else {
      // Log OTP in development
      console.log(`Development OTP for ${phoneNumber}: ${otpInfo.otp}`);
    }

    return new SendOtpResponseDto(phoneNumber);
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<VerifyOtpResponseDto> {
    const { phoneNumber, otp } = verifyOtpDto;

    const isLocalOrDevelopmentEnv =
      this.configService.get('NODE_ENV') === ENVIRONMENTS.LOCAL ||
      this.configService.get('NODE_ENV') === ENVIRONMENTS.DEVELOPMENT;

    // Validate OTP
    const { verified, message } = await this.otpService.validateOtp({
      identifier: phoneNumber,
      otp,
    });

    const isDevBypass = isLocalOrDevelopmentEnv && otp === '1234';

    if (!verified && !isDevBypass) {
      throw new HttpException(message || 'message.AUTH.OTP.INVALID', 400);
    }

    // Check if user exists or create a new one
    const user = await this.userService.checkUserExistence(phoneNumber);

    if (!user) {
      const temporaryToken =
        this.tokenService.generateTemporaryToken(phoneNumber);
      return new VerifyOtpResponseDto({
        isNewUser: true,
        tempOtpToken: temporaryToken,
        phoneNumber,
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      throw new UnauthorizedException('message.AUTH.USER.ACCOUNT_INACTIVE');
    }

    // Generate tokens
    const accessToken = this.tokenService.generateAccessToken(
      user.id,
      RoleEnum.USER,
    );
    const refreshToken = this.tokenService.generateRefreshToken(
      user.id,
      RoleEnum.USER,
    );

    return new VerifyOtpResponseDto({
      isNewUser: false,
      phoneNumber,
      accessToken,
      refreshToken,
      userId: user.id,
    });
  }

  async signUp(authSignupDto: AuthSignupDto): Promise<AuthSignupResponseDto> {
    const { email, fullName } = authSignupDto;

    const verifiedToken = this.tokenService.validateTemporaryToken(
      authSignupDto.otpTempToken,
    );
    if (!verifiedToken) {
      throw new HttpException('message.AUTH.INVALID_TOKEN', 400);
    }

    // const user = await this.userService.findByPhone(verifiedToken.phoneNumber);

    // if (user) {
    //   throw new HttpException('message.AUTH.USER.ALREADY_EXISTS_PHONE', 400);
    // }

    const newUser = await this.userService.createUserWithRole(
      {
        phoneNumber: verifiedToken.phoneNumber,
        fullName,
        email,
      },
      RoleEnum.USER,
    );

    const accessToken = this.tokenService.generateAccessToken(
      newUser.id,
      newUser.role,
    );

    const refreshToken = this.tokenService.generateRefreshToken(
      newUser.id,
      newUser.role,
    );

    return new AuthSignupResponseDto({
      fullName: newUser.fullName,
      phoneNumber: newUser.phoneNumber,
      userId: newUser.id,
      email: newUser.email,
      accessToken,
      refreshToken,
    });
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponseDto> {
    const tokens = await this.tokenService.rotateRefreshToken(refreshToken);
    if (!tokens) {
      throw new UnauthorizedException('message.AUTH.INVALID_REFRESH_TOKEN');
    }
    return new RefreshTokenResponseDto(tokens.accessToken, tokens.refreshToken);
  }

  async findUser(userId: string) {
    return this.userService.findUser({ id: userId });
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = loginDto;

    // Find user by username
    const user = await this.userService.findUser({ username });

    if (!user) {
      throw new UnauthorizedException('message.AUTH.INVALID_CREDENTIALS');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('message.AUTH.INVALID_CREDENTIALS');
    }

    // Check if user is active
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

    return new LoginResponseDto({
      accessToken,
      refreshToken,
      userId: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    });
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const { username, email, password } = registerDto;

    // Create user using UserService (which handles validation and hashing)
    const newUser = await this.userService.create({
      username,
      email,
      password,
      phoneNumber: `+98${Date.now()}`, // Generate a temporary phone number
      fullName: username, // Use username as default fullName
    });

    // Generate tokens
    const accessToken = this.tokenService.generateAccessToken(
      newUser.id,
      newUser.role,
    );
    const refreshToken = this.tokenService.generateRefreshToken(
      newUser.id,
      newUser.role,
    );

    return new RegisterResponseDto({
      accessToken,
      refreshToken,
      userId: newUser.id,
      username: newUser.username,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
    });
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    const { phoneNumber } = forgotPasswordDto;

    // Verify user exists
    const user = await this.userService.findByPhoneNumber(phoneNumber);
    if (!user) {
      throw new BadRequestException('message.USER.NOT_FOUND');
    }

    // Generate and send OTP
    const otpInfo = await this.otpService.generateOtp(phoneNumber);

    // Mock SMS sending (log in development, send in production)
    if (isProduction()) {
      this.smsService.sendMessage({
        message: this.i18nService.translate(
          'message.AUTH.OTP.PASSWORD_RESET_CODE',
          {
            args: { code: otpInfo.otp },
          },
        ),
        to: phoneNumber,
      });
    } else {
      console.log(`[PASSWORD RESET] OTP for ${phoneNumber}: ${otpInfo.otp}`);
    }

    return new ForgotPasswordResponseDto(
      phoneNumber,
      'OTP sent to your phone number',
    );
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    const { phoneNumber, otp, newPassword } = resetPasswordDto;

    const isLocalOrDevelopmentEnv =
      this.configService.get('NODE_ENV') === ENVIRONMENTS.LOCAL ||
      this.configService.get('NODE_ENV') === ENVIRONMENTS.DEVELOPMENT;

    // Validate OTP
    const { verified, message } = await this.otpService.validateOtp({
      identifier: phoneNumber,
      otp,
    });

    const isDevBypass = isLocalOrDevelopmentEnv && otp === '1234';

    if (!verified && !isDevBypass) {
      throw new HttpException(message || 'message.AUTH.OTP.INVALID', 400);
    }

    // Find user
    const user = await this.userService.findByPhoneNumber(phoneNumber);
    if (!user) {
      throw new BadRequestException('message.USER.NOT_FOUND');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Save user with new password
    await this.userService.update(user.id, { password: newPassword });

    return new ResetPasswordResponseDto(true, 'Password reset successfully');
  }
}
