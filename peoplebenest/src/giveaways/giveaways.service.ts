import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Giveaway, GiveawayStatus, GiveawayCategory } from '../entities/giveaway.entity';
import { GiveawayImage } from '../entities/giveaway-image.entity';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';
import { CreateGiveawayDto } from './dto/create-giveaway.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GiveawaysService {
  constructor(
    @InjectRepository(Giveaway)
    private giveawayRepository: Repository<Giveaway>,
    @InjectRepository(GiveawayImage)
    private giveawayImageRepository: Repository<GiveawayImage>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createGiveawayDto: CreateGiveawayDto, user: User) {
    const showUpDuration = createGiveawayDto.show_up_duration || 24;
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + showUpDuration);

    const giveaway = this.giveawayRepository.create({
      ...createGiveawayDto,
      user_id: user.id,
      expiration_time: expirationTime,
      status: GiveawayStatus.NORMAL,
    });

    const savedGiveaway = await this.giveawayRepository.save(giveaway);

    // Handle images
    if (createGiveawayDto.images && createGiveawayDto.images.length > 0) {
      const uploadDir = path.join(process.cwd(), 'uploads', 'giveaways');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      for (const base64Image of createGiveawayDto.images) {
        const imageBuffer = Buffer.from(base64Image, 'base64');
        const fileName = `${savedGiveaway.id}_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, imageBuffer);

        const image = this.giveawayImageRepository.create({
          giveaway_id: savedGiveaway.id,
          image_path: `/uploads/giveaways/${fileName}`,
        });
        await this.giveawayImageRepository.save(image);
      }
    }

    // Notify nearby users
    if (giveaway.latitude && giveaway.longitude) {
      await this.notifyNearbyUsers(savedGiveaway, user);
    }

    return this.findOne(savedGiveaway.id, user);
  }

  async findAll(user: User, category?: GiveawayCategory) {
    const query = this.giveawayRepository
      .createQueryBuilder('giveaway')
      .where('giveaway.user_id != :userId', { userId: user.id })
      .andWhere('giveaway.status = :status', { status: GiveawayStatus.NORMAL })
      .andWhere('giveaway.expiration_time > :now', { now: new Date() })
      .leftJoinAndSelect('giveaway.user', 'user')
      .leftJoinAndSelect('giveaway.images', 'images')
      .orderBy('giveaway.created_at', 'DESC');

    if (category) {
      query.andWhere('giveaway.category = :category', { category });
    }

    const giveaways = await query.getMany();

    return giveaways.map((g) => this.formatGiveaway(g));
  }

  async findOne(id: number, user: User) {
    const giveaway = await this.giveawayRepository.findOne({
      where: { id },
      relations: ['user', 'images'],
    });

    if (!giveaway) {
      throw new NotFoundException('Giveaway not found');
    }

    return {
      success: true,
      data: this.formatGiveaway(giveaway),
    };
  }

  async updateStatus(id: number, updateStatusDto: UpdateStatusDto, user: User) {
    const giveaway = await this.giveawayRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!giveaway) {
      throw new NotFoundException('Giveaway not found');
    }

    if (giveaway.user_id !== user.id) {
      throw new ForbiddenException('You can only update your own giveaways');
    }

    giveaway.status = updateStatusDto.status;
    await this.giveawayRepository.save(giveaway);

    // If status changed to holded, notify requesters
    if (updateStatusDto.status === GiveawayStatus.HOLDED) {
      const notifications = await this.notificationRepository.find({
        where: { food_id: id },
        relations: ['requester'],
      });

      for (const notification of notifications) {
        // Create message or additional notification logic here
      }
    }

    return {
      success: true,
      message: 'Status updated successfully',
      data: this.formatGiveaway(giveaway),
    };
  }

  async requestItem(id: number, user: User) {
    const giveaway = await this.giveawayRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!giveaway) {
      throw new NotFoundException('Giveaway not found');
    }

    if (giveaway.user_id === user.id) {
      throw new BadRequestException('You cannot request your own giveaway');
    }

    // Create notification
    const notification = this.notificationRepository.create({
      poster_id: giveaway.user_id,
      requester_id: user.id,
      food_id: id,
      message: `${user.name} requested your item: ${giveaway.food_title}`,
      is_read: false,
    });

    await this.notificationRepository.save(notification);

    return {
      success: true,
      message: 'Request sent successfully',
    };
  }

  async delete(id: number, user: User) {
    const giveaway = await this.giveawayRepository.findOne({
      where: { id },
    });

    if (!giveaway) {
      throw new NotFoundException('Giveaway not found');
    }

    if (giveaway.user_id !== user.id) {
      throw new ForbiddenException('You can only delete your own giveaways');
    }

    await this.giveawayRepository.remove(giveaway);

    return {
      success: true,
      message: 'Giveaway deleted successfully',
    };
  }

  async homelessRequests(user: User) {
    return this.findAll(user, GiveawayCategory.HOMELESS);
  }

  private async notifyNearbyUsers(giveaway: Giveaway, poster: User) {
    if (!giveaway.latitude || !giveaway.longitude) {
      return;
    }

    const radius = 10; // 10 km

    const nearbyUsers = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.latitude',
        'user.longitude',
      ])
      .addSelect(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(user.latitude)) * 
        cos(radians(user.longitude) - radians(:lng)) + 
        sin(radians(:lat)) * sin(radians(user.latitude))))`,
        'distance',
      )
      .having('distance < :radius', { radius })
      .where('user.id != :posterId', { posterId: poster.id })
      .setParameters({
        lat: giveaway.latitude,
        lng: giveaway.longitude,
      })
      .getRawMany();

    for (const nearbyUser of nearbyUsers) {
      const notification = this.notificationRepository.create({
        poster_id: poster.id,
        requester_id: nearbyUser.user_id,
        food_id: giveaway.id,
        message: `New ${giveaway.category} available near you: ${giveaway.food_title}`,
        is_read: false,
      });
      await this.notificationRepository.save(notification);
    }
  }

  private formatGiveaway(giveaway: Giveaway) {
    return {
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
    };
  }
}

