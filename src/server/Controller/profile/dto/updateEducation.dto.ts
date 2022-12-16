import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateEducationDto {
  @IsNumber()
  @IsNotEmpty()
  educationId: number;

  @IsString()
  @IsNotEmpty()
  school: string;

  @IsString()
  @IsNotEmpty()
  degree: string;

  @IsString()
  @IsNotEmpty()
  fieldStudy: string;

  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  grade: string;

  @IsString()
  @IsNotEmpty()
  activities: string;

  @IsString()
  @IsNotEmpty()
  desc: string;
}
