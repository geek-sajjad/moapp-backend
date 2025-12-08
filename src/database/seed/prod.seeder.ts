import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ENVIRONMENTS, RoleEnum } from 'src/core/enums';
import { UserEntity, UserProfileEntity } from 'src/modules/user/entities';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { ProviderEntity } from 'src/modules/provider/entities';

@Injectable()
export class ProdSeeder {
  private readonly logger = new Logger(ProdSeeder.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProviderEntity)
    private readonly providerRepository: Repository<ProviderEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async seed(): Promise<void> {
    console.log('started running seeder');
    const foundedAdmin = await this.userRepository.findOne({
      where: {
        role: RoleEnum.ADMIN,
      },
    });
    if (!foundedAdmin) {
      console.log('creating admin');
      try {
        await this.dataSource.transaction(async () => {
          const user = new UserEntity();
          user.email =
            this.configService.getOrThrow<string>('SUPER_ADMIN_EMAIL');
          user.phoneNumber = '0000000001';
          user.role = RoleEnum.ADMIN;

          const password = this.configService.getOrThrow<string>(
            'SUPER_ADMIN_PASSWORD',
          );
          user.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
          await this.userRepository.save(user);

          const profile = new UserProfileEntity();
          Object.assign<UserProfileEntity, DeepPartial<UserProfileEntity>>(
            profile,
            {
              fullName: 'Admin',
              // lastName: '----',

              user: {
                id: user.id,
              },
            },
          );

          await this.userProfileRepository.save(profile);
        });
        this.logger.log('Admin user created successfully');
      } catch (error) {
        this.logger.error('Failed to create admin user in transaction:', error);
        throw error;
      }
    }

    if (
      this.configService.getOrThrow<string>('NODE_ENV') !==
      ENVIRONMENTS.PRODUCTION
    ) {
      // Provider
      const user = new UserEntity();
      user.email = 'test_user@gmail.com';
      user.phoneNumber = '0000000003';
      user.role = RoleEnum.PROVIDER;

      user.password = await bcrypt.hash('password', await bcrypt.genSalt(10));

      const userId = (await this.userRepository.save(user)).id;
      const provider = new ProviderEntity();

      const providerProfile = new UserProfileEntity();
      Object.assign<UserProfileEntity, DeepPartial<UserProfileEntity>>(
        providerProfile,
        {
          fullName: 'Test Provider Profile',
          user: {
            id: userId,
          },
        },
      );
      Object.assign<ProviderEntity, DeepPartial<ProviderEntity>>(provider, {
        // maxDailyOrders: 100,
        isActive: true,
        user: {
          id: userId,
        },
      });
      await Promise.all([
        this.providerRepository.save(provider),
        this.userProfileRepository.save(providerProfile),
      ]);
    }
  }
}
