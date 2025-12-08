// src/firebase/firebase.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import { UserService } from 'src/modules/user/services';
import { FirebaseDto, FirebaseRegisterTokenDto } from './dto';

@Injectable()
export class FirebaseService {
  constructor(private readonly userService: UserService) {}

  get messaging() {
    return admin.messaging();
  }

  async sendMessage(params: FirebaseDto): Promise<string> {
    try {
      const messageId = await admin
        .messaging()
        .send(params as unknown as Message);
      return messageId;
    } catch (error) {
      if (
        error.errorInfo.code === 'messaging/registration-token-not-registered'
      ) {
        await this.removeInvalidToken(params.token);
        throw new BadRequestException('message.FIREBASE.INVALID_TOKEN');
      }
      throw new BadRequestException(error.message);
    }
  }

  async registerToken(params: FirebaseRegisterTokenDto) {
    this.userService.updateFirebaseToken(params.identifier, params.token);
  }

  private async removeInvalidToken(token: string) {
    await this.userService.updateInvalidToken(token);
  }
}
