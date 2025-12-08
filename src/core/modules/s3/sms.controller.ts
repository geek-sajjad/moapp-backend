import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseWithModel } from 'src/core/decorators';
import { SmsService } from '../sms/sms.service';
import { SmsMessageDto, SmsSendMessageResponseDto } from '../sms/dto';

@ApiTags('sms')
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send sms using twilio' })
  @ApiResponseWithModel(SmsSendMessageResponseDto, 'sms sent', 201)
  async sendSms(
    @Body() smsMessageDto: SmsMessageDto,
  ): Promise<SmsSendMessageResponseDto> {
    return this.smsService.sendMessage(smsMessageDto);
  }
}
