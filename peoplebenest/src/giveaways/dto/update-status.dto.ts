import { IsEnum } from 'class-validator';
import { GiveawayStatus } from '../../entities/giveaway.entity';

export class UpdateStatusDto {
  @IsEnum(GiveawayStatus)
  status: GiveawayStatus;
}

