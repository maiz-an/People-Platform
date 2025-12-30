import {
  IsString,
  IsNumber,
  IsOptional,
  IsEmail,
  Min,
  Max,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(18)
  @Max(100)
  age: number;

  @IsString()
  post: string;

  @IsEmail()
  email: string;

  @IsString()
  nic_passport: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  photo?: string; // base64 encoded
}

