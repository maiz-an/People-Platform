import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class RegisterOrganizationDto {
  @IsString()
  @MinLength(2)
  org_name: string;

  @IsString()
  org_type: string;

  @IsString()
  org_registration: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  address: string;

  @IsString()
  services: string;

  @IsString()
  @MinLength(6)
  org_password: string;

  @IsString()
  @IsOptional()
  proof_registration?: string; // base64 encoded

  @IsString()
  @IsOptional()
  profile_pic?: string; // base64 encoded
}

