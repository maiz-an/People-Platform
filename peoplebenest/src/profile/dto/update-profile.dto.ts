import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { UserGender } from '../../entities/user.entity';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(UserGender)
  @IsOptional()
  gender?: UserGender;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
}

