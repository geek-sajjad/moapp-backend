import { Controller, Post, Body, Patch } from '@nestjs/common';
import { ResponseUtil } from 'src/core/utilities';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/core/dtos/responses';
import { ApiResponseWithModel } from 'src/core/decorators';
import { FirebaseService } from './firebase.service';
import { FirebaseDto, FirebaseRegisterTokenDto } from './dto';

@ApiTags('firebase')
@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send firebase message' })
  @ApiResponseWithModel(FirebaseDto, 'Register client token')
  async sendMessage(@Body() params: FirebaseDto): Promise<ResponseDto<string>> {
    const messageId = await this.firebaseService.sendMessage(params);
    return ResponseUtil.success('message.FIREBASE.SENDING_SUCCEED', messageId);
  }

  @Patch('register-token')
  @ApiOperation({ summary: 'Register client token' })
  @ApiResponseWithModel(FirebaseRegisterTokenDto, 'Register client token')
  async registerToken(
    @Body() params: FirebaseRegisterTokenDto,
  ): Promise<ResponseDto<void>> {
    await this.firebaseService.registerToken(params);
    return ResponseUtil.success('message.FIREBASE.TOKEN_REGISTERED', null);
  }
}
