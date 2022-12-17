import { IsNotEmpty, IsString } from 'class-validator';

export class AddSkillDto {
  @IsString()
  @IsNotEmpty()
  skillName: string;
}
