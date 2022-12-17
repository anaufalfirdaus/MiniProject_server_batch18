import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

enum AddressType {
  'Home' = 1,
  'Main Office' = 2,
  'Primary' = 3,
  'Shipping' = 4,
  'Billing' = 5,
  'Archive' = 6,
}

export class AddAddressDto {
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @IsString()
  @IsNotEmpty()
  addressLine2: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsNumber()
  @IsNotEmpty()
  cityId: number;

  @IsNumber()
  @IsNotEmpty()
  @IsEnum(AddressType)
  addressType: number;
}
