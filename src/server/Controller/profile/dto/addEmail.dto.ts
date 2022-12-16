import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class AddEmailDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
