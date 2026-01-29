import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import * as bcrypt from 'bcryptjs';
import { UserAdminEntity, UserEntity } from '../entities';
import { UserAdminRepository, UserRepository } from '../repositories';
import {
  CreateAdminDto,
  UpdateAdminDto,
  ExtendSubscriptionDto,
} from '../dto/requests';
import { AdminResponseDto, UserResponseDto } from '../dto/responses';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserAdminEntity)
    private readonly adminRepository: UserAdminRepository,
    @InjectRepository(UserEntity)
    private readonly userRepository: UserRepository,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  // ==================== Admin Management ====================

  async createAdmin(createDto: CreateAdminDto): Promise<AdminResponseDto> {
    // Check if username already exists
    const existingUsername = await this.adminRepository.findByUsername(
      createDto.username,
    );
    if (existingUsername) {
      throw new ConflictException('message.ADMIN.USERNAME_EXISTS');
    }

    // Check if email already exists
    const existingEmail = await this.adminRepository.findByEmail(
      createDto.email,
    );
    if (existingEmail) {
      throw new ConflictException('message.ADMIN.EMAIL_EXISTS');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createDto.password, 10);

    const admin = this.adminRepository.create({
      ...createDto,
      password: hashedPassword,
    });

    const savedAdmin = await this.adminRepository.save(admin);
    return this.mapper.map(savedAdmin, UserAdminEntity, AdminResponseDto);
  }

  async findAllAdmins(): Promise<AdminResponseDto[]> {
    const admins = await this.adminRepository.find({
      order: { createdAt: 'DESC' },
    });
    return this.mapper.mapArray(admins, UserAdminEntity, AdminResponseDto);
  }

  async findAdminById(id: string): Promise<AdminResponseDto> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException('message.ADMIN.NOT_FOUND');
    }
    return this.mapper.map(admin, UserAdminEntity, AdminResponseDto);
  }

  async findAdminByUsername(username: string): Promise<UserAdminEntity | null> {
    return this.adminRepository.findByUsername(username);
  }

  async findAdminByEmail(email: string): Promise<UserAdminEntity | null> {
    return this.adminRepository.findByEmail(email);
  }

  async updateAdmin(
    id: string,
    updateDto: UpdateAdminDto,
  ): Promise<AdminResponseDto> {
    // Find the admin entity directly (not the DTO)
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException('message.ADMIN.NOT_FOUND');
    }

    // Check username uniqueness if being updated
    if (updateDto.username && updateDto.username !== admin.username) {
      const existingUsername = await this.adminRepository.findByUsername(
        updateDto.username,
      );
      if (existingUsername) {
        throw new ConflictException('message.ADMIN.USERNAME_EXISTS');
      }
    }

    // Check email uniqueness if being updated
    if (updateDto.email && updateDto.email !== admin.email) {
      const existingEmail = await this.adminRepository.findByEmail(
        updateDto.email,
      );
      if (existingEmail) {
        throw new ConflictException('message.ADMIN.EMAIL_EXISTS');
      }
    }

    // Hash password if being updated
    const updateData = { ...updateDto };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    Object.assign(admin, updateData);
    const updatedAdmin = await this.adminRepository.save(admin);
    return this.mapper.map(updatedAdmin, UserAdminEntity, AdminResponseDto);
  }

  async deleteAdmin(id: string): Promise<boolean> {
    // Check if admin exists first
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException('message.ADMIN.NOT_FOUND');
    }

    const deleted = await this.adminRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundException('message.ADMIN.NOT_FOUND');
    }
    return deleted;
  }

  // ==================== User Management (Admin Functions) ====================

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
    return this.mapper.mapArray(users, UserEntity, UserResponseDto);
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('message.USER.NOT_FOUND');
    }
    return this.mapper.map(user, UserEntity, UserResponseDto);
  }

  async deleteUser(id: string): Promise<boolean> {
    const deleted = await this.userRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundException('message.USER.NOT_FOUND');
    }
    return deleted;
  }

  // ==================== Subscription Management ====================

  async extendSubscription(
    extendDto: ExtendSubscriptionDto,
  ): Promise<UserResponseDto> {
    // Get the entity directly for update
    const user = await this.userRepository.findOne({
      where: { id: extendDto.userId },
    });
    if (!user) {
      throw new NotFoundException('message.USER.NOT_FOUND');
    }

    user.subscriptionEndDate = extendDto.subscriptionEndDate;
    const updatedUser = await this.userRepository.save(user);
    return this.mapper.map(updatedUser, UserEntity, UserResponseDto);
  }

  async revokeSubscription(userId: string): Promise<UserResponseDto> {
    // Get the entity directly for update
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('message.USER.NOT_FOUND');
    }

    user.subscriptionEndDate = null;
    const updatedUser = await this.userRepository.save(user);
    return this.mapper.map(updatedUser, UserEntity, UserResponseDto);
  }

  async getUsersWithActiveSubscription(): Promise<UserResponseDto[]> {
    const allUsers = await this.userRepository.find();
    const activeUsers = allUsers.filter((user) => user.isSubscriptionActive());
    return this.mapper.mapArray(activeUsers, UserEntity, UserResponseDto);
  }

  async getUsersWithExpiredSubscription(): Promise<UserResponseDto[]> {
    const allUsers = await this.userRepository.find();
    const expiredUsers = allUsers.filter(
      (user) => !user.isSubscriptionActive(),
    );
    return this.mapper.mapArray(expiredUsers, UserEntity, UserResponseDto);
  }
}
