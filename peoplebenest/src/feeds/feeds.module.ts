import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedsService } from './feeds.service';
import { FeedsController } from './feeds.controller';
import { Feed } from '../entities/feed.entity';
import { Like } from '../entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feed, Like])],
  controllers: [FeedsController],
  providers: [FeedsService],
})
export class FeedsModule {}

