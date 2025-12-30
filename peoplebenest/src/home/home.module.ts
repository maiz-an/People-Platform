import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { Giveaway } from '../entities/giveaway.entity';
import { Message } from '../entities/message.entity';
import { Notification } from '../entities/notification.entity';
import apiConfig from '../config/api.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Giveaway, Message, Notification]),
    ConfigModule.forFeature(apiConfig),
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}

