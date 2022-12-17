import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum PhoneType {
  'Home',
  'Cell',
}

export class AddPhoneDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(PhoneType)
  phoneCode: string;
}
