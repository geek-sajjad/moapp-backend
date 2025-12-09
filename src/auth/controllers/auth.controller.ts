import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithModel } from 'src/core/decorators';
import { ResponseDto } from 'src/core/dtos/responses';
import { ResponseUtil } from 'src/core/utilities';
import { OtpMedium } from 'src/core/modules/otp/enums';
import {
  AuthSignupResponseDto,
  VerifyOtpResponseDto,
  LoginResponseDto,
  RegisterResponseDto,
  ForgotPasswordResponseDto,
  ResetPasswordResponseDto,
} from '../dtos/responses';
import {
  AuthSignupDto,
  RefreshTokenDto,
  SendOtpDto,
  VerifyOtpDto,
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../dtos/requests';
import { AuthService } from '../services';
import { SendOtpResponseDto } from '../dtos/responses/send-otp.response.dto';
import { RefreshTokenResponseDto } from '../dtos/responses/refresh-token.response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Send OTP code for user phone number' })
  @ApiResponseWithModel(SendOtpResponseDto, 'OTP code sent successfully', 200)
  @Post('send-otp')
  async sendOtp(
    @Body() sendOtpDto: SendOtpDto,
  ): Promise<ResponseDto<SendOtpResponseDto>> {
    const response = await this.authService.sendOtp(
      {
        phoneNumber: sendOtpDto.phoneNumber,
      },
      OtpMedium.SMS,
    );
    return ResponseUtil.success<SendOtpResponseDto>(
      'message.AUTH.OTP.SENT',
      response,
    );
  }

  @ApiOperation({ summary: 'Verify OTP code' })
  @ApiResponseWithModel(
    VerifyOtpResponseDto,
    'OTP code verified successfully',
    200,
  )
  @Post('verify-otp')
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<ResponseDto<VerifyOtpResponseDto>> {
    const response = await this.authService.verifyOtp(verifyOtpDto);
    return ResponseUtil.success<VerifyOtpResponseDto>(
      'message.AUTH.OTP.VERIFIED',
      response,
    );
  }

  @ApiOperation({
    summary: 'Sign up a new user',
    description:
      'This endpoint allows a new user to sign up using their phone number and OTP verification. It requires a valid access token obtained from the OTP verification process.',
  })
  @ApiResponseWithModel(AuthSignupResponseDto, 'User created successfully', 200)
  @Post('sign-up')
  async signUp(
    @Body() dto: AuthSignupDto,
  ): Promise<ResponseDto<AuthSignupResponseDto>> {
    const response = await this.authService.signUp(dto);
    return ResponseUtil.success<AuthSignupResponseDto>(
      'message.AUTH.USER.CREATED',
      response,
    );
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponseWithModel(
    RefreshTokenResponseDto,
    'Token refreshed successfully',
    200,
  )
  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<ResponseDto<RefreshTokenResponseDto>> {
    const response = await this.authService.refreshToken(
      refreshTokenDto.refreshToken,
    );
    return ResponseUtil.success<RefreshTokenResponseDto>(
      'message.AUTH.REFRESH_TOKEN_GENERATED',
      response,
    );
  }

  @ApiOperation({ summary: 'Login with username and password' })
  @ApiResponseWithModel(LoginResponseDto, 'User logged in successfully', 200)
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<ResponseDto<LoginResponseDto>> {
    const response = await this.authService.login(dto);
    return ResponseUtil.success<LoginResponseDto>(
      'message.AUTH.LOGIN_SUCCESS',
      response,
    );
  }

  @ApiOperation({ summary: 'Register a new user with username and password' })
  @ApiResponseWithModel(
    RegisterResponseDto,
    'User registered successfully',
    200,
  )
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
  ): Promise<ResponseDto<RegisterResponseDto>> {
    const response = await this.authService.register(dto);
    return ResponseUtil.success<RegisterResponseDto>(
      'message.AUTH.REGISTER_SUCCESS',
      response,
    );
  }

  @ApiOperation({
    summary: 'Request password reset',
    description: 'Send an OTP code to the user phone number for password reset',
  })
  @ApiResponseWithModel(ForgotPasswordResponseDto, 'OTP sent successfully', 200)
  @Post('forgot-password')
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<ResponseDto<ForgotPasswordResponseDto>> {
    const response = await this.authService.forgotPassword(dto);
    return ResponseUtil.success<ForgotPasswordResponseDto>(
      'message.AUTH.OTP.SENT',
      response,
    );
  }

  @ApiOperation({
    summary: 'Reset password',
    description: 'Reset user password using OTP verification',
  })
  @ApiResponseWithModel(
    ResetPasswordResponseDto,
    'Password reset successfully',
    200,
  )
  @Post('reset-password')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<ResponseDto<ResetPasswordResponseDto>> {
    const response = await this.authService.resetPassword(dto);
    return ResponseUtil.success<ResetPasswordResponseDto>(
      'message.AUTH.PASSWORD_RESET_SUCCESS',
      response,
    );
  }
}
