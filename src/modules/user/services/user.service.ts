import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../entities';
import { UserRepository } from '../repositories';
import { CreateUserDto, UpdateUserDto } from '../dto/requests';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: UserRepository,
  ) {}

  async create(createDto: CreateUserDto): Promise<UserEntity> {
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

    // Check if email already exists (if provided)
    if (createDto.email) {
      const existingEmail = await this.userRepository.findByEmail(
        createDto.email,
      );
      if (existingEmail) {
        throw new ConflictException('message.USER.EMAIL_EXISTS');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createDto.password, 10);

    const user = this.userRepository.create({
      ...createDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async createUserWithRole(
    createDto: Partial<CreateUserDto>,
    role: string,
  ): Promise<UserEntity> {
    // Check if username already exists
    if (createDto.username) {
      const existingUsername = await this.userRepository.findByUsername(
        createDto.username,
      );
      if (existingUsername) {
        throw new ConflictException('message.USER.USERNAME_EXISTS');
      }
    }

    // Check if phone number already exists
    if (createDto.phoneNumber) {
      const existingPhone = await this.userRepository.findByPhoneNumber(
        createDto.phoneNumber,
      );
      if (existingPhone) {
        throw new ConflictException('message.USER.PHONE_EXISTS');
      }
    }

    // Check if email already exists (if provided)
    if (createDto.email) {
      const existingEmail = await this.userRepository.findByEmail(
        createDto.email,
      );
      if (existingEmail) {
        throw new ConflictException('message.USER.EMAIL_EXISTS');
      }
    }

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (createDto.password) {
      hashedPassword = await bcrypt.hash(createDto.password, 10);
    }

    const userData = {
      username: createDto.username || '',
      phoneNumber: createDto.phoneNumber || '',
      fullName: createDto.fullName || '',
      email: createDto.email,
      password: hashedPassword || '',
      role: role as any,
    };

    const user = this.userRepository.create(userData);

    return this.userRepository.save(user);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('message.USER.NOT_FOUND');
    }
    return user;
  }

  async findUser(where: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where });
    if (!user) {
      throw new NotFoundException('message.USER.NOT_FOUND');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserEntity | null> {
    return this.userRepository.findByPhoneNumber(phoneNumber);
  }

  async checkUserExistence(phoneNumber: string): Promise<UserEntity | null> {
    return this.userRepository.findByPhoneNumber(phoneNumber);
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);

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

    // Check email uniqueness if being updated
    if (updateDto.email && updateDto.email !== user.email) {
      const existingEmail = await this.userRepository.findByEmail(
        updateDto.email,
      );
      if (existingEmail) {
        throw new ConflictException('message.USER.EMAIL_EXISTS');
      }
    }

    // Hash password if being updated
    const updateData = { ...updateDto };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.userRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundException('message.USER.NOT_FOUND');
    }
    return deleted;
  }

  async updateFirebaseToken(identifier: string, token: string): Promise<void> {
    const user = await this.userRepository.findByPhoneNumber(identifier);
    if (user) {
      user.firebaseToken = token;
      await this.userRepository.save(user);
    }
  }

  async updateInvalidToken(token: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { firebaseToken: token },
    });
    if (user) {
      user.firebaseToken = null;
      await this.userRepository.save(user);
    }
  }
}
