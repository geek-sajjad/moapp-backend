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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from '../services';
import {
  CreateAdminDto,
  UpdateAdminDto,
  ExtendSubscriptionDto,
} from '../dto/requests';
import { AdminResponseDto, UserResponseDto } from '../dto/responses';
import { ResponseDto } from 'src/core/dtos/responses';
import { ResponseUtil } from 'src/core/utilities';
import { ApiResponseWithModel } from 'src/core/decorators';
import { AdminAuthGuard } from 'src/core/guards';
import { ParamAsUUID } from 'src/core/dtos/requests/uuid-param.request.dto';

@ApiTags('Admin Management')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(AdminAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ==================== Admin Management ====================

  @Post('admins')
  @ApiOperation({ summary: 'Create new admin' })
  @ApiResponseWithModel(AdminResponseDto, 'Create new admin')
  async createAdmin(
    @Body() createDto: CreateAdminDto,
  ): Promise<ResponseDto<AdminResponseDto>> {
    const result = await this.adminService.createAdmin(createDto);
    return ResponseUtil.success('message.ADMIN.CREATED', result);
  }

  @Get('admins')
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponseWithModel([AdminResponseDto], 'Get all admins')
  async getAllAdmins(): Promise<ResponseDto<AdminResponseDto[]>> {
    const result = await this.adminService.findAllAdmins();
    return ResponseUtil.success('message.ADMIN.RETRIEVED', result);
  }

  @Get('admins/:id')
  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiResponseWithModel(AdminResponseDto, 'Get admin by ID')
  async getAdminById(
    @Param() params: ParamAsUUID,
  ): Promise<ResponseDto<AdminResponseDto>> {
    const result = await this.adminService.findAdminById(params.id);
    return ResponseUtil.success('message.ADMIN.GET_ADMIN', result);
  }

  @Patch('admins/:id')
  @ApiOperation({ summary: 'Update admin' })
  @ApiResponseWithModel(AdminResponseDto, 'Update admin')
  async updateAdmin(
    @Param() params: ParamAsUUID,
    @Body() updateDto: UpdateAdminDto,
  ): Promise<ResponseDto<AdminResponseDto>> {
    const result = await this.adminService.updateAdmin(params.id, updateDto);
    return ResponseUtil.success('message.ADMIN.UPDATE_SUCCEED', result);
  }

  @Delete('admins/:id')
  @ApiOperation({ summary: 'Delete admin' })
  @ApiResponseWithModel(Boolean, 'Delete admin')
  async deleteAdmin(
    @Param() params: ParamAsUUID,
  ): Promise<ResponseDto<boolean>> {
    const result = await this.adminService.deleteAdmin(params.id);
    return ResponseUtil.success('message.ADMIN.DELETE_SUCCESS', result);
  }

  // ==================== User Management ====================

  @Get('users')
  @ApiOperation({ summary: 'Get all users (Admin)' })
  @ApiResponseWithModel([UserResponseDto], 'Get all users')
  async getAllUsers(): Promise<ResponseDto<UserResponseDto[]>> {
    const result = await this.adminService.getAllUsers();
    return ResponseUtil.success('message.USER.RETRIEVED', result);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID (Admin)' })
  @ApiResponseWithModel(UserResponseDto, 'Get user by ID')
  async getUserById(
    @Param() params: ParamAsUUID,
  ): Promise<ResponseDto<UserResponseDto>> {
    const result = await this.adminService.getUserById(params.id);
    return ResponseUtil.success('message.USER.GET_USER', result);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user (Admin)' })
  @ApiResponseWithModel(Boolean, 'Delete user')
  async deleteUser(
    @Param() params: ParamAsUUID,
  ): Promise<ResponseDto<boolean>> {
    const result = await this.adminService.deleteUser(params.id);
    return ResponseUtil.success('message.USER.DELETE_SUCCESS', result);
  }

  // ==================== Subscription Management ====================

  @Post('subscriptions/extend')
  @ApiOperation({ summary: 'Extend user subscription' })
  @ApiResponseWithModel(UserResponseDto, 'Extend user subscription')
  async extendSubscription(
    @Body() extendDto: ExtendSubscriptionDto,
  ): Promise<ResponseDto<UserResponseDto>> {
    const result = await this.adminService.extendSubscription(extendDto);
    return ResponseUtil.success('message.SUBSCRIPTION.EXTENDED', result);
  }

  @Post('subscriptions/revoke/:id')
  @ApiOperation({ summary: 'Revoke user subscription' })
  @ApiResponseWithModel(UserResponseDto, 'Revoke user subscription')
  async revokeSubscription(
    @Param() params: ParamAsUUID,
  ): Promise<ResponseDto<UserResponseDto>> {
    const result = await this.adminService.revokeSubscription(params.id);
    return ResponseUtil.success('message.SUBSCRIPTION.REVOKED', result);
  }

  @Get('subscriptions/active')
  @ApiOperation({ summary: 'Get users with active subscriptions' })
  @ApiResponseWithModel(
    [UserResponseDto],
    'Get users with active subscriptions',
  )
  async getUsersWithActiveSubscription(): Promise<
    ResponseDto<UserResponseDto[]>
  > {
    const result = await this.adminService.getUsersWithActiveSubscription();
    return ResponseUtil.success('message.USER.RETRIEVED', result);
  }

  @Get('subscriptions/expired')
  @ApiOperation({ summary: 'Get users with expired subscriptions' })
  @ApiResponseWithModel(
    [UserResponseDto],
    'Get users with expired subscriptions',
  )
  async getUsersWithExpiredSubscription(): Promise<
    ResponseDto<UserResponseDto[]>
  > {
    const result = await this.adminService.getUsersWithExpiredSubscription();
    return ResponseUtil.success('message.USER.RETRIEVED', result);
  }
}
