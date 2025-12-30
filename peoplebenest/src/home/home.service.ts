import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Giveaway, GiveawayStatus } from '../entities/giveaway.entity';
import { Message } from '../entities/message.entity';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Giveaway)
    private giveawayRepository: Repository<Giveaway>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private configService: ConfigService,
  ) {}

  async getHomeData(user: User) {
    // Get active giveaways
    const giveaways = await this.giveawayRepository.find({
      where: {
        status: GiveawayStatus.NORMAL,
      },
      relations: ['user', 'images'],
      order: { created_at: 'DESC' },
      take: 20,
    });

    // Get unread message count
    const unreadMessagesCount = await this.messageRepository.count({
      where: {
        receiver_id: user.id,
        is_read: false,
      },
    });

    // Get unread notifications count
    const unreadNotificationsCount = await this.notificationRepository.count({
      where: {
        requester_id: user.id,
        is_read: false,
      },
    });

    // Get poll intervals from config
    const pollIntervals = this.configService.get('api.pollIntervals');

    // Format giveaways
    const formattedGiveaways = giveaways.map((giveaway) => ({
      id: giveaway.id,
      food_title: giveaway.food_title,
      description: giveaway.description,
      quantity: giveaway.quantity,
      pickup_time: giveaway.pickup_time,
      pickup_instruction: giveaway.pickup_instruction,
      latitude: giveaway.latitude,
      longitude: giveaway.longitude,
      expiration_time: giveaway.expiration_time,
      status: giveaway.status,
      category: giveaway.category,
      created_at: giveaway.created_at,
      poster: {
        id: giveaway.user.id,
        name: giveaway.user.name,
        profile_pic: giveaway.user.profile_pic
          ? Buffer.from(giveaway.user.profile_pic).toString('base64')
          : null,
      },
      images: giveaway.images?.map((img) => img.image_path) || [],
    }));

    return {
      success: true,
      data: {
        giveaways: formattedGiveaways,
        unread_messages_count: unreadMessagesCount,
        unread_notifications_count: unreadNotificationsCount,
        poll_intervals: pollIntervals,
        api_base_url: this.configService.get('api.baseUrl'),
      },
    };
  }
}

