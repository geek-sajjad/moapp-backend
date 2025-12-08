import { I18nService } from 'nestjs-i18n';
import { OtpService } from 'src/core/modules/otp/otp.service';
import { SmsService } from 'src/core/modules/sms/sms.service';
import { UserService } from 'src/modules/user/services';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService, TokenService } from '../services';
import { VerifyOtpDto } from '../dtos/requests';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let tokenService: TokenService;
  let otpService: OtpService;
  let smsService: SmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findUser: jest.fn(),
            findByPhone: jest.fn(),
            createByPhoneNumber: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            generateAccessToken: jest.fn(),
            generateRefreshToken: jest.fn(),
            validateToken: jest.fn(),
          },
        },
        {
          provide: OtpService,
          useValue: {
            generateOtp: jest.fn(),
            validateOtp: jest.fn(),
          },
        },
        {
          provide: SmsService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
        {
          provide: I18nService,
          useValue: {
            translate: jest
              .fn()
              .mockReturnValue('Your OTP code is {{property}}'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    tokenService = module.get<TokenService>(TokenService);
    otpService = module.get<OtpService>(OtpService);
    smsService = module.get<SmsService>(SmsService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('sendOtp', () => {
    it('should generate and send an OTP', async () => {
      const sendOtpDto = { phoneNumber: '1234567890' };
      const mockOtp = { otp: '1234', identifier: sendOtpDto.phoneNumber };

      jest.spyOn(otpService, 'generateOtp').mockReturnValue(mockOtp);
      jest.spyOn(smsService, 'sendMessage');

      const result = await authService.sendOtp(sendOtpDto);

      expect(otpService.generateOtp).toHaveBeenCalledWith(
        sendOtpDto.phoneNumber,
      );
      expect(smsService.sendMessage).toHaveBeenCalled();
      expect(result.otp).toBe('1234');
    });
  });

  describe('verifyOtp', () => {
    it('should verify OTP and return accessToken for existing user', async () => {
      const verifyOtpDto: VerifyOtpDto = {
        phoneNumber: '1234567890',
        otp: '1234',
      };
      const mockUser = {
        id: '1',
        role: Role.CUSTOMER,
        name: '',
        email: '',
        phoneNumber: verifyOtpDto.phoneNumber,
      };

      jest.spyOn(otpService, 'validateOtp').mockReturnValue({
        verified: true,
        identifier: verifyOtpDto.phoneNumber,
        otp: verifyOtpDto.otp,
      });
      jest.spyOn(userService, 'findByPhone').mockResolvedValue(mockUser);
      jest
        .spyOn(tokenService, 'generateAccessToken')
        .mockReturnValue('access-token');

      const result = await authService.verifyOtp(verifyOtpDto);

      expect(otpService.validateOtp).toHaveBeenCalledWith({
        identifier: verifyOtpDto.phoneNumber,
        otp: verifyOtpDto.otp,
      });
      expect(result.accessToken).toBe('access-token');
      expect(result.isNewUser).toBe(false);
    });

    it('should verify OTP and return accessToken for new user', async () => {
      const verifyOtpDto: VerifyOtpDto = {
        phoneNumber: '1234567890',
        otp: '1234',
      };
      const mockUser = {
        id: '1',
        role: Role.CUSTOMER,
        name: '',
        email: '',
        phoneNumber: verifyOtpDto.phoneNumber,
      };
      jest.spyOn(otpService, 'validateOtp').mockReturnValue({
        verified: true,
        identifier: verifyOtpDto.phoneNumber,
        otp: verifyOtpDto.otp,
      });
      jest.spyOn(userService, 'findByPhone').mockResolvedValue(null);

      jest
        .spyOn(userService, 'createByPhoneNumber')
        .mockResolvedValue(mockUser);
      jest
        .spyOn(tokenService, 'generateAccessToken')
        .mockReturnValue('access-token');

      const result = await authService.verifyOtp(verifyOtpDto);

      expect(otpService.validateOtp).toHaveBeenCalledWith({
        identifier: verifyOtpDto.phoneNumber,
        otp: verifyOtpDto.otp,
      });
      expect(result.accessToken).toBe('access-token');
      expect(result.isNewUser).toBe(true);
    });
  });
});
