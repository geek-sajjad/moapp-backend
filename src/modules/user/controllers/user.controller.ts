import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/core/dtos/responses';
import { ResponseUtil } from 'src/core/utilities';
import { AuthGuard } from 'src/core/guards';
import { CurrentUser } from 'src/auth/decorators';
import { UserPayload } from 'src/core/types';
import { UserService } from '../services';
import { UpdateUserDto } from '../dto/requests';
import { UserResponseDto } from '../dto/responses';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getCurrentUser(
    @CurrentUser() user: UserPayload,
  ): Promise<ResponseDto<UserResponseDto>> {
    const result = await this.userService.findOne(user.id);
    return ResponseUtil.success('message.USER.GET_USER', result);
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  async updateCurrentUser(
    @CurrentUser() user: UserPayload,
    @Body() updateDto: UpdateUserDto,
  ): Promise<ResponseDto<UserResponseDto>> {
    const result = await this.userService.update(user.id, updateDto);
    return ResponseUtil.success('message.USER.UPDATE_SUCCEED', result);
  }
}
