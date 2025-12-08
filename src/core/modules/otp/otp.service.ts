import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { ClientException } from 'src/core/exceptions';
import { OtpDto, OtpGenerationResponseDto, OtpResponseDto } from './dto';
import { OtpEntity } from './entities/otp.entity';
import { OtpAttemptEntity } from './entities/attempt.entity';

@Injectable()
export class OtpService {
  constructor(
    private readonly configService: ConfigService,
    private readonly i18nService: I18nService,
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
    @InjectRepository(OtpAttemptEntity)
    private readonly attemptRepository: Repository<OtpAttemptEntity>,
  ) {}

  private readonly maxAttempts =
    this.configService.get<number>('MAX_ATTEMPS') || 3;

  private readonly expireAfter =
    this.configService.get<number>('EXPIRE_AFTER') || 5;

  private readonly lockDurationMinutes =
    this.configService.get<number>('LOCK_DURATION_MINUTES') || 30;

  private generateNumericOtp(length: number): string {
    let otp = '';
    for (let i = 0; i < length; i += 1) {
      otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
  }

  async generateOtp(identifier: string): Promise<OtpGenerationResponseDto> {
    const otp = this.generateNumericOtp(4);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.expireAfter);

    // Delete any existing OTP for this identifier
    await this.otpRepository.delete({ identifier });

    // Create new OTP
    await this.otpRepository.save({
      identifier,
      otp,
      expiresAt,
    });

    // Reset attempts
    await this.attemptRepository.delete({ identifier });
    await this.attemptRepository.save({
      identifier,
      attempts: 0,
      lockedUntil: null,
    });

    return new OtpGenerationResponseDto(identifier, otp);
  }

  async validateOtp(params: OtpDto): Promise<OtpResponseDto> {
    const { identifier, otp } = params;

    const storedOtp = await this.otpRepository.findOne({
      where: { identifier },
    });
    const attemptData = await this.attemptRepository.findOne({
      where: { identifier },
    });

    if (!storedOtp || !attemptData) {
      const message = 'message.AUTH.OTP.NOT_FOUND';
      return new OtpResponseDto(
        identifier,
        false,
        this.i18nService.translate(message),
        otp,
      );
    }

    const { otp: storedCode, expiresAt } = storedOtp;
    const { attempts, lockedUntil } = attemptData;

    // Check if user is locked out
    if (lockedUntil && new Date() < lockedUntil) {
      const message = 'message.AUTH.OTP.LOCKED_OUT';
      return new OtpResponseDto(
        identifier,
        false,
        this.i18nService.translate(message, {
          args: { LOCK_DURATION: this.lockDurationMinutes.toString() },
        }),
        otp,
      );
    }

    // Check if OTP is valid
    if (new Date() > expiresAt) {
      const message = 'message.AUTH.OTP.EXPIRED';
      return new OtpResponseDto(
        identifier,
        false,
        this.i18nService.translate(message),
        otp,
      );
    }

    if (storedCode === otp) {
      // OTP is valid, reset attempts and delete OTP
      await this.otpRepository.delete({ identifier });
      await this.attemptRepository.delete({ identifier });
      return new OtpResponseDto(
        identifier,
        true,
        this.i18nService.translate('message.AUTH.OTP.VALIDATION_SUCCEED'),
        otp,
      );
    }

    // Increment attempts and handle lockout
    if (attempts + 1 >= this.maxAttempts) {
      const lockUntil = new Date();
      lockUntil.setMinutes(lockUntil.getMinutes() + this.lockDurationMinutes);
      await this.attemptRepository.update(
        { identifier },
        { attempts: 0, lockedUntil: lockUntil },
      );
      throw new ClientException('message.AUTH.OTP.ATTEMPT_EXCEEDED', {
        LOCK_DURATION: this.lockDurationMinutes.toString(),
      });
    }

    await this.attemptRepository.update(
      { identifier },
      { attempts: attempts + 1, lockedUntil: null },
    );

    const message = 'message.AUTH.OTP.INVALID';
    return new OtpResponseDto(
      identifier,
      false,
      this.i18nService.translate(message),
      otp,
    );
  }
}
