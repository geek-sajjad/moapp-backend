import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService, AdminService } from 'src/modules/user/services';
import { TokenService } from './token.service';
import { LoginDto } from '../dtos/requests';
import { RefreshTokenResponseDto, LoginResponseDto } from '../dtos/responses';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly tokenService: TokenService,
  ) {}

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponseDto> {
    const tokens = await this.tokenService.rotateRefreshToken(refreshToken);
    if (!tokens) {
      throw new UnauthorizedException('message.AUTH.INVALID_REFRESH_TOKEN');
    }
    return new RefreshTokenResponseDto(tokens.accessToken, tokens.refreshToken);
  }

  async findUser(userId: string) {
    return this.userService.findUser({ id: userId });
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = loginDto;

    // Find user by username (need raw entity for password comparison)
    const user = await this.userService.findUserEntityForAuth({ username });

    if (!user) {
      throw new UnauthorizedException('message.AUTH.INVALID_CREDENTIALS');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('message.AUTH.INVALID_CREDENTIALS');
    }

    // Generate tokens
    const accessToken = this.tokenService.generateAccessToken(user.id);
    const refreshToken = this.tokenService.generateRefreshToken(user.id);

    return new LoginResponseDto({
      accessToken,
      refreshToken,
      userId: user.id,
      username: user.username,
      fullName: user.fullName,
    });
  }

  async adminLogin(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = loginDto;
    console.log(username, password);

    // Find admin by username
    const admin = await this.adminService.findAdminByUsername(username);

    if (!admin) {
      throw new UnauthorizedException('message.AUTH.INVALID_CREDENTIALS');
    }

    // Check if admin is active
    if (!admin.isActive) {
      throw new UnauthorizedException('message.AUTH.ACCOUNT_DISABLED');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('message.AUTH.INVALID_CREDENTIALS');
    }

    // Generate admin tokens (separate from user tokens)
    const accessToken = this.tokenService.generateAdminAccessToken(
      admin.id,
      admin.email,
    );
    const refreshToken = this.tokenService.generateAdminRefreshToken(admin.id);

    return new LoginResponseDto({
      accessToken,
      refreshToken,
      userId: admin.id,
      username: admin.username,
      fullName: admin.fullName,
    });
  }
}
