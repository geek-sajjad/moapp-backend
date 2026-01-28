import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithModel } from 'src/core/decorators';
import { ResponseDto } from 'src/core/dtos/responses';
import { ResponseUtil } from 'src/core/utilities';
import { LoginResponseDto } from '../dtos/responses';
import { RefreshTokenDto, LoginDto } from '../dtos/requests';
import { AuthService } from '../services';
import { RefreshTokenResponseDto } from '../dtos/responses/refresh-token.response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
