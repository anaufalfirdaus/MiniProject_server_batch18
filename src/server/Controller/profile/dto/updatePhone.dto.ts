import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

enum PhoneType {
  'Home',
  'Cell',
}

export class UpdatePhoneDto {
  @IsNumber()
  @IsNotEmpty()
  phoneId: number;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(PhoneType)
  phoneCode: string;
}
