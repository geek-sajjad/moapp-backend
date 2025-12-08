import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateUserDto } from 'src/modules/user/dto/requests';

export class AuthSignupDto extends OmitType(CreateUserDto, [
  'password',
  'phoneNumber',
]) {
  @IsString({
    message: 'validation.IS_STRING',
  })
  @ApiProperty({
    description: 'The otp Temp Token ',
    type: String,
  })
  otpTempToken: string;
}
