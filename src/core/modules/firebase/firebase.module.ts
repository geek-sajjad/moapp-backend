import { Global, Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { FirebaseService } from './firebase.service';

@Global()
@Module({
  imports: [UserModule],
  controllers: [],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
