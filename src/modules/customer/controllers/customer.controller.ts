import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CustomerService } from '../services';
import { CreateCustomerDto, UpdateCustomerDto } from '../dto/requests';
import { CustomerResponseDto } from '../dto/responses';
import { AuthGuard } from 'src/core/guards';
import { CurrentUser } from 'src/auth/decorators';
import { UserPayload } from 'src/core/types';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  async create(
    @CurrentUser() user: UserPayload,
    @Body() dto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return await this.customerService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiQuery({
    name: 'includeArchived',
    required: false,
    type: Boolean,
    description: 'Include archived customers',
  })
  async findAll(
    @CurrentUser() user: UserPayload,
    @Query('includeArchived') includeArchived?: boolean,
  ): Promise<CustomerResponseDto[]> {
    return await this.customerService.findAll(
      user.id,
      includeArchived === true,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by id' })
  async findOne(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ): Promise<CustomerResponseDto> {
    return await this.customerService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update customer name or phone number' })
  async update(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return await this.customerService.update(id, user.id, dto);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive customer' })
  async archive(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ): Promise<CustomerResponseDto> {
    return await this.customerService.archive(id, user.id);
  }

  @Patch(':id/unarchive')
  @ApiOperation({ summary: 'Unarchive customer' })
  async unarchive(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ): Promise<CustomerResponseDto> {
    return await this.customerService.unarchive(id, user.id);
  }
}
