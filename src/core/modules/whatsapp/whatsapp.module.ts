import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RequestUtil } from 'src/core/utilities/request.util';
import { WhatsappService } from './whatsapp.service';

@Global()
@Module({
  providers: [WhatsappService, RequestUtil],
  imports: [HttpModule],
})
export class WhatsappModule {}
