import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAdminEntity } from 'src/modules/user/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ProdSeeder {
  private readonly logger = new Logger(ProdSeeder.name);

  constructor(
    @InjectRepository(UserAdminEntity)
    private readonly adminRepository: Repository<UserAdminEntity>,
    private readonly configService: ConfigService,
  ) {}

  async seed(): Promise<void> {
    this.logger.log('Starting admin seeder...');

    // Check if default admin already exists
    const existingAdmin = await this.adminRepository.findOne({
      where: { username: 'admin' },
    });

    if (existingAdmin) {
      this.logger.log('Default admin already exists, skipping...');
      return;
    }

    // Get admin credentials from environment or use defaults
    const adminUsername = this.configService.get<string>(
      'ADMIN_USERNAME',
      'admin',
    );
    const adminEmail = this.configService.get<string>(
      'ADMIN_EMAIL',
      'admin@daftarmoein.com',
    );
    const adminPassword = this.configService.get<string>(
      'ADMIN_PASSWORD',
      'Admin@12345',
    );
    const adminFullName = this.configService.get<string>(
      'ADMIN_FULL_NAME',
      'System Administrator',
    );

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create default admin
    const admin = this.adminRepository.create({
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      fullName: adminFullName,
      isActive: true,
    });

    await this.adminRepository.save(admin);

    this.logger.log('Default admin created successfully');
    this.logger.log(`Username: ${adminUsername}`);
    this.logger.log(`Email: ${adminEmail}`);
    this.logger.log('Please change the default password after first login!');
  }
}
