import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserGender } from '../../entities/user.entity';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserGender)
  @IsOptional()
  gender?: UserGender;
}

