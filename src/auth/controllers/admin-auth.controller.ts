import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithModel } from 'src/core/decorators';
import { ResponseDto } from 'src/core/dtos/responses';
import { ResponseUtil } from 'src/core/utilities';
import { LoginResponseDto } from '../dtos/responses';
import { LoginDto } from '../dtos/requests';
import { AuthService } from '../services';

@ApiTags('Admin Auth')
@Controller('auth/admin')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Admin login with username and password' })
  @ApiResponseWithModel(LoginResponseDto, 'Admin logged in successfully', 200)
  @Post('login')
  async adminLogin(
    @Body() dto: LoginDto,
  ): Promise<ResponseDto<LoginResponseDto>> {
    console.log(dto);
    const response = await this.authService.adminLogin(dto);
    return ResponseUtil.success<LoginResponseDto>(
      'message.AUTH.LOGIN_SUCCESS',
      response,
    );
  }
}
