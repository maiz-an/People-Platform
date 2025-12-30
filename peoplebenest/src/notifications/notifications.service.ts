import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { Subscription } from '../entities/subscription.entity';
import { User } from '../entities/user.entity';
import { SubscribeDto } from './dto/subscribe.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async findAll(user: User) {
    const notifications = await this.notificationRepository.find({
      where: { requester_id: user.id },
      relations: ['poster', 'foodItem'],
      order: { created_at: 'DESC' },
      take: 50,
    });

    return notifications.map((notif) => ({
      id: notif.id,
      message: notif.message,
      is_read: notif.is_read,
      created_at: notif.created_at,
      poster: {
        id: notif.poster.id,
        name: notif.poster.name,
        profile_pic: notif.poster.profile_pic
          ? Buffer.from(notif.poster.profile_pic).toString('base64')
          : null,
      },
      food_item: notif.foodItem
        ? {
            id: notif.foodItem.id,
            food_title: notif.foodItem.food_title,
          }
        : null,
    }));
  }

  async markAsRead(id: number, user: User) {
    const notification = await this.notificationRepository.findOne({
      where: { id, requester_id: user.id },
    });

    if (notification) {
      notification.is_read = true;
      await this.notificationRepository.save(notification);
    }

    return {
      success: true,
      message: 'Notification marked as read',
    };
  }

  async getUnreadCount(user: User) {
    const count = await this.notificationRepository.count({
      where: {
        requester_id: user.id,
        is_read: false,
      },
    });

    return {
      success: true,
      data: {
        unread_count: count,
      },
    };
  }

  async subscribe(subscribeDto: SubscribeDto, user: User) {
    // Check if subscription already exists
    const existing = await this.subscriptionRepository.findOne({
      where: {
        user_id: user.id,
        endpoint: subscribeDto.endpoint,
      },
    });

    if (existing) {
      existing.p256dh = subscribeDto.keys.p256dh;
      existing.auth = subscribeDto.keys.auth;
      await this.subscriptionRepository.save(existing);
    } else {
      const subscription = this.subscriptionRepository.create({
        user_id: user.id,
        endpoint: subscribeDto.endpoint,
        p256dh: subscribeDto.keys.p256dh,
        auth: subscribeDto.keys.auth,
      });
      await this.subscriptionRepository.save(subscription);
    }

    return {
      success: true,
      message: 'Subscribed to push notifications',
    };
  }
}

