import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithModel } from 'src/core/decorators';
import { ResponseDto } from 'src/core/dtos/responses';
import { ResponseUtil } from 'src/core/utilities';
import { OtpMedium } from 'src/core/modules/otp/enums';
import { AuthSignupResponseDto, VerifyOtpResponseDto } from '../dtos/responses';
import {
  AuthSignupDto,
  RefreshTokenDto,
  SendOtpDto,
  VerifyOtpDto,
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
}
