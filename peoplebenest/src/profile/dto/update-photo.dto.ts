import { IsString } from 'class-validator';

export class UpdatePhotoDto {
  @IsString()
  profile_pic: string; // base64 encoded
}

