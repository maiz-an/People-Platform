import { IsString, IsOptional } from 'class-validator';

export class UpdateOrganizationDto {
  @IsString()
  @IsOptional()
  org_name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  services?: string;
}

