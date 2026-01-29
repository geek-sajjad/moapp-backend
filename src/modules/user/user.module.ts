import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserService, AdminService } from './services';
import { UserController, AdminController } from './controllers';
import { UserEntity, UserAdminEntity } from './entities';
import { UserRepository, UserAdminRepository } from './repositories';
import { createRepository } from 'src/core/repositories/repository.factory';
import { UserMappingProfile } from './mapping-profiles/user.mapping-profile';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserAdminEntity])],
  controllers: [UserController, AdminController],
  providers: [
    UserService,
    AdminService,
    UserMappingProfile,
    {
      provide: UserRepository,
      useFactory: (dataSource: DataSource) =>
        createRepository<UserEntity, UserRepository>(
          dataSource,
          UserRepository,
        ),
      inject: [DataSource],
    },
    {
      provide: UserAdminRepository,
      useFactory: (dataSource: DataSource) =>
        createRepository<UserAdminEntity, UserAdminRepository>(
          dataSource,
          UserAdminRepository,
        ),
      inject: [DataSource],
    },
  ],
  exports: [UserService, AdminService],
})
export class UserModule {}
