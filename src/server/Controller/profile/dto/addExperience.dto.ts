import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddExperienceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  profileHeadline: string;

  @IsString()
  @IsNotEmpty()
  employmentType: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsNumber()
  @IsNotEmpty()
  cityId: number;

  @IsString()
  @IsNotEmpty()
  isCurrent: string;

  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  industry: string;

  @IsString()
  @IsNotEmpty()
  desc: string;

  @IsString()
  @IsNotEmpty()
  experienceType: string;
}
