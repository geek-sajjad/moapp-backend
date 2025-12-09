import { Injectable, Logger } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
// import { ConfigService } from '@nestjs/config';
// import { InjectRepository } from '@nestjs/typeorm';
// import { ENVIRONMENTS, RoleEnum } from 'src/core/enums';
// import { UserEntity, UserProfileEntity } from 'src/modules/user/entities';
// import { DataSource, DeepPartial, Repository } from 'typeorm';
// import { ProviderEntity } from 'src/modules/provider/entities';

@Injectable()
export class ProdSeeder {
  private readonly logger = new Logger(ProdSeeder.name);

  async seed(): Promise<void> {
    console.log('seeder');
  }
}
