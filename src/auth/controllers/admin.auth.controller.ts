import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiResponseWithModel } from 'src/core/decorators';
import { ResponseDto } from 'src/core/dtos/responses';
import { ResponseUtil } from 'src/core/utilities';
import { AdminAuthService } from '../services';
import {
  AdminLoginDto,
  AdminForgotPasswordDto,
  RefreshTokenDto,
  AdminResetPasswordDto,
} from '../dtos/requests';
import {
  AdminLoginResponseDto,
  RefreshTokenResponseDto,
} from '../dtos/responses';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth - admin - provider')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(
    private readonly adminAuthService: AdminAuthService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Admin login with email and password' })
  @ApiResponseWithModel(
    AdminLoginResponseDto,
    'Admin logged in successfully',
    200,
  )
  @Post('login')
  async adminLogin(
    @Body() loginDto: AdminLoginDto,
  ): Promise<ResponseDto<AdminLoginResponseDto>> {
    const response = await this.adminAuthService.login(loginDto);
    return ResponseUtil.success<AdminLoginResponseDto>(
      'message.AUTH.LOGIN_SUCCESS',
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

  @ApiOperation({ summary: 'Send password reset link to admin email' })
  @HttpCode(200)
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: AdminForgotPasswordDto,
  ): Promise<void> {
    await this.adminAuthService.forgotPassword(forgotPasswordDto.email);
  }

  @ApiOperation({ summary: 'Reset admin/provider password' })
  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: AdminResetPasswordDto,
  ): Promise<void> {
    await this.adminAuthService.resetPassword(resetPasswordDto);
  }
}
