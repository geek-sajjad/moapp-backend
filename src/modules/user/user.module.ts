import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserService } from './services';
import { UserController } from './controllers';
import { UserEntity } from './entities';
import { UserRepository } from './repositories';
import { createRepository } from 'src/core/repositories/repository.factory';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useFactory: (dataSource: DataSource) =>
        createRepository<UserEntity, UserRepository>(
          dataSource,
          UserRepository,
        ),
      inject: [DataSource],
    },
  ],
  exports: [UserService],
})
export class UserModule {}
