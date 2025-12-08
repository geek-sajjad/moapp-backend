import { Controller, Post, Body } from '@nestjs/common';
import { ResponseUtil } from 'src/core/utilities';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/core/dtos/responses';
import { EmailService } from './email.service';
import { EmailDto, EmailParams } from './dto';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-template')
  @ApiOperation({ summary: 'Send Email by template' })
  async sendTemplateEmail(
    @Body() params: EmailParams,
  ): Promise<ResponseDto<string>> {
    await this.emailService.sendTemplateEmail(params);
    return ResponseUtil.success('message.EMAIL.SENDING_SUCCEED', '');
  }

  @Post('send')
  @ApiOperation({ summary: 'Send Email' })
  async sendEmail(@Body() params: EmailDto): Promise<ResponseDto<string>> {
    await this.emailService.sendEmail(params);
    return ResponseUtil.success('message.EMAIL.SENDING_SUCCEED', '');
  }
}
