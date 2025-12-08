import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ResponseUtil } from 'src/core/utilities';
import { SinglePageDto } from 'src/core/dtos/responses';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseWithModel } from 'src/core/decorators';
import { OtpService } from './otp.service';
import { OtpDto, OtpGenerationResponseDto, OtpResponseDto } from './dto';
import { OtpGenerationDto } from './dto/opt-generation.dto';

@ApiTags('otp')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate otp based on the identifier' })
  @ApiResponseWithModel(OtpGenerationResponseDto, 'generate otp')
  async generateOtp(
    @Body() otpGenerationDto: OtpGenerationDto,
  ): Promise<SinglePageDto<OtpGenerationResponseDto>> {
    try {
      const otp = await this.otpService.generateOtp(
        otpGenerationDto.identifier,
      );
      return ResponseUtil.singleData(otp);
    } catch (_error) {
      throw new BadRequestException('errors.FAILD_OTP_GENERATION');
    }
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate otp by identifier' })
  @ApiResponseWithModel(OtpResponseDto, 'Validate otp')
  async validateOtp(
    @Body() params: OtpDto,
  ): Promise<SinglePageDto<OtpResponseDto>> {
    const result = await this.otpService.validateOtp(params);
    return ResponseUtil.singleData(result);
  }
}
