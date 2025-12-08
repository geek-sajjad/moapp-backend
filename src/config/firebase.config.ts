import { ConfigService } from '@nestjs/config';

import { ServiceAccount } from 'firebase-admin';

import * as admin from 'firebase-admin';

export const configFirebase = (configService: ConfigService) => {
  const serviceAccount: ServiceAccount = {
    projectId: configService.get('FIREBASE_PROJECT_ID'),
    privateKey: configService
      .get('FIREBASE_PRIVATE_KEY')
      .replace(/\\n/gm, '\n'),
    clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
  };
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
};
