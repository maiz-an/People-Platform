import { IsString, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class KeysDto {
  @IsString()
  p256dh: string;

  @IsString()
  auth: string;
}

export class SubscribeDto {
  @IsString()
  endpoint: string;

  @IsObject()
  @ValidateNested()
  @Type(() => KeysDto)
  keys: KeysDto;
}

