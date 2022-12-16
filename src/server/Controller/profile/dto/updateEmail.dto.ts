import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateEmailDto {
  @IsNumber()
  @IsNotEmpty()
  emailId: number;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
