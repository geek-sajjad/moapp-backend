import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../entities';
import { UserRepository } from '../repositories';
import { CreateUserDto, UpdateUserDto } from '../dto/requests';
import { UserResponseDto } from '../dto/responses';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async create(createDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if username already exists
    const existingUsername = await this.userRepository.findByUsername(
      createDto.username,
    );
    if (existingUsername) {
      throw new ConflictException('message.USER.USERNAME_EXISTS');
    }

    // Check if phone number already exists
    const existingPhone = await this.userRepository.findByPhoneNumber(
      createDto.phoneNumber,
    );
    if (existingPhone) {
      throw new ConflictException('message.USER.PHONE_EXISTS');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createDto.password, 10);

    const user = this.userRepository.create({
      ...createDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    return this.mapper.map(savedUser, UserEntity, UserResponseDto);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
    return this.mapper.mapArray(users, UserEntity, UserResponseDto);
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('message.USER.NOT_FOUND');
    }
    return this.mapper.map(user, UserEntity, UserResponseDto);
  }

  async findUser(where: Partial<UserEntity>): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where });
    if (!user) {
      throw new NotFoundException('message.USER.NOT_FOUND');
    }
    return this.mapper.map(user, UserEntity, UserResponseDto);
  }

  /**
   * Internal method to find user entity for authentication purposes
   * Returns raw entity including password field
   */
  async findUserEntityForAuth(
    where: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserEntity | null> {
    return this.userRepository.findByPhoneNumber(phoneNumber);
  }

  async checkUserExistence(phoneNumber: string): Promise<UserEntity | null> {
    return this.userRepository.findByPhoneNumber(phoneNumber);
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<UserResponseDto> {
    // Find the user entity directly (not the DTO)
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('message.USER.NOT_FOUND');
    }

    // Check username uniqueness if being updated
    if (updateDto.username && updateDto.username !== user.username) {
      const existingUsername = await this.userRepository.findByUsername(
        updateDto.username,
      );
      if (existingUsername) {
        throw new ConflictException('message.USER.USERNAME_EXISTS');
      }
    }

    // Check phone uniqueness if being updated
    if (updateDto.phoneNumber && updateDto.phoneNumber !== user.phoneNumber) {
      const existingPhone = await this.userRepository.findByPhoneNumber(
        updateDto.phoneNumber,
      );
      if (existingPhone) {
        throw new ConflictException('message.USER.PHONE_EXISTS');
      }
    }

    // Hash password if being updated
    const updateData = { ...updateDto };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    Object.assign(user, updateData);
    const updatedUser = await this.userRepository.save(user);
    return this.mapper.map(updatedUser, UserEntity, UserResponseDto);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.userRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundException('message.USER.NOT_FOUND');
    }
    return deleted;
  }
}
