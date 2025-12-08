import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  ApiPaginatedResponse,
  ApiResponseWithModel,
} from 'src/core/decorators';
import { ResponseUtil } from 'src/core/utilities';
import { ResponseDto, SinglePageDto } from 'src/core/dtos/responses';
import * as path from 'path';
import * as fs from 'fs';
import { VersionResponseDto } from './dtos/responses';
import { AddVersionDto } from './dtos/requests';
import { VersioningService } from './versioning.service';

@ApiTags('Versioning')
@Controller('')
export class VersioningController {
  constructor(private readonly versioningService: VersioningService) {}

  @Get('')
  async index(): Promise<ResponseDto<VersionResponseDto>> {
    return ResponseUtil.success<VersionResponseDto>('message.MESSAGE', null);
  }

  @ApiOperation({ summary: 'Get all version ' })
  @ApiPaginatedResponse(VersionResponseDto)
  @Get('versioning')
  async getLatestVersion(): Promise<SinglePageDto<VersionResponseDto[]>> {
    const versions = await this.versioningService.findAll();
    return ResponseUtil.singleData(versions);
  }

  @ApiOperation({ summary: 'Add a new version' })
  @ApiResponseWithModel(VersionResponseDto, 'Version added successfully', 201)
  @Post('versioning')
  async addVersion(
    @Body() params: AddVersionDto,
  ): Promise<ResponseDto<VersionResponseDto>> {
    const newVersion = await this.versioningService.save({
      version: params.version,
      forceUpdate: params.forceUpdate,
    });

    return ResponseUtil.success<VersionResponseDto>(
      'message.VERSION.ADD_SUCCESS',
      newVersion,
    );
  }

  @Get('versioning/latest')
  @ApiResponseWithModel(
    VersionResponseDto,
    'Latest version retrieved successfully',
    200,
  )
  async getLatest(): Promise<ResponseDto<VersionResponseDto>> {
    const latestVersion = await this.versioningService.getLatest();
    return ResponseUtil.success<VersionResponseDto>(
      'message.VERSION.LATEST_VERSION',
      latestVersion,
    );
  }

  async getPackageVersion(): Promise<ResponseDto<{ version: string }>> {
    let version;
    try {
      const packageJsonPath = path.resolve(
        __dirname,
        '../../../../package.json',
      );
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      version = packageJson.version;
    } catch (error) {
      version = 'Could not fetch the version';
    }
    return ResponseUtil.success<{ version: string }>(
      'message.VERSION.LATEST_PACKAGE_VERSION',
      {
        version,
      },
    );
  }
}
