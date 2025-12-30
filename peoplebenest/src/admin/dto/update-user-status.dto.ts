import { IsEnum } from 'class-validator';
import { UserStatus } from '../../entities/user.entity';

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  status: UserStatus;
}

