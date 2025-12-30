import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  Min,
} from 'class-validator';
import { GiveawayCategory } from '../../entities/giveaway.entity';

export class CreateGiveawayDto {
  @IsString()
  food_title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  quantity: string;

  @IsString()
  @IsOptional()
  pickup_time?: string;

  @IsString()
  @IsOptional()
  pickup_instruction?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsEnum(GiveawayCategory)
  category: GiveawayCategory;

  @IsNumber()
  @Min(1)
  @IsOptional()
  show_up_duration?: number; // in hours

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[]; // base64 encoded
}

