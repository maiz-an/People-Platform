import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiveawaysService } from './giveaways.service';
import { GiveawaysController } from './giveaways.controller';
import { Giveaway } from '../entities/giveaway.entity';
import { GiveawayImage } from '../entities/giveaway-image.entity';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Giveaway, GiveawayImage, Notification, User]),
  ],
  controllers: [GiveawaysController],
  providers: [GiveawaysService],
})
export class GiveawaysModule {}

