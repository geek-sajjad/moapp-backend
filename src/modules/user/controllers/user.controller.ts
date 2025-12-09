import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/core/dtos/responses';
import { ResponseUtil } from 'src/core/utilities';
import { AuthGuard } from 'src/core/guards';
import { ParseUUIDCustomPipe } from 'src/core/pipes';
import { CurrentUser } from 'src/auth/decorators';
import { UserPayload } from 'src/core/types';
import { UserService } from '../services';
import { CreateUserDto, UpdateUserDto } from '../dto/requests';
import { UserResponseDto } from '../dto/responses';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  async create(
    @Body() createDto: CreateUserDto,
  ): Promise<ResponseDto<UserResponseDto>> {
    const user = await this.userService.create(createDto);
    return ResponseUtil.success('message.USER.CREATED', user);
  }

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

  @Delete('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete current user account' })
  async deleteCurrentUser(
    @CurrentUser() user: UserPayload,
  ): Promise<ResponseDto<boolean>> {
    const result = await this.userService.delete(user.id);
    return ResponseUtil.success('message.USER.DELETE_SUCCESS', result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'string',
    format: 'uuid',
  })
  async findOne(
    @Param('id', ParseUUIDCustomPipe) id: string,
  ): Promise<ResponseDto<UserResponseDto>> {
    const result = await this.userService.findOne(id);
    return ResponseUtil.success('message.USER.GET_USER', result);
  }
}
