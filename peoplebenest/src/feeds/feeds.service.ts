import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feed } from '../entities/feed.entity';
import { Like } from '../entities/like.entity';
import { User } from '../entities/user.entity';
import { CreateFeedDto } from './dto/create-feed.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(Feed)
    private feedRepository: Repository<Feed>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async create(createFeedDto: CreateFeedDto, user: User) {
    let imagePath = null;

    if (createFeedDto.content_img) {
      const uploadDir = path.join(process.cwd(), 'uploads', 'feeds');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const imageBuffer = Buffer.from(createFeedDto.content_img, 'base64');
      const fileName = `${user.id}_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, imageBuffer);
      imagePath = `/uploads/feeds/${fileName}`;
    }

    const feed = this.feedRepository.create({
      user_id: user.id,
      content: createFeedDto.content,
      content_img: imagePath ? fs.readFileSync(path.join(process.cwd(), imagePath)) : null,
      feed_type: createFeedDto.feed_type,
      likes_count: 0,
    });

    const savedFeed = await this.feedRepository.save(feed);

    return this.findOne(savedFeed.id, user);
  }

  async findAll(user: User) {
    const feeds = await this.feedRepository.find({
      relations: ['user', 'likes'],
      order: { created_at: 'DESC' },
      take: 50,
    });

    return feeds.map((feed) => this.formatFeed(feed, user.id));
  }

  async findOne(id: number, user: User) {
    const feed = await this.feedRepository.findOne({
      where: { id },
      relations: ['user', 'likes'],
    });

    if (!feed) {
      throw new NotFoundException('Feed not found');
    }

    return {
      success: true,
      data: this.formatFeed(feed, user.id),
    };
  }

  async like(id: number, user: User) {
    const feed = await this.feedRepository.findOne({ where: { id } });

    if (!feed) {
      throw new NotFoundException('Feed not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { user_id: user.id, feed_id: id },
    });

    if (existingLike) {
      // Unlike
      await this.likeRepository.remove(existingLike);
      feed.likes_count = Math.max(0, feed.likes_count - 1);
      await this.feedRepository.save(feed);
      return { success: true, message: 'Unliked', liked: false };
    } else {
      // Like
      const like = this.likeRepository.create({
        user_id: user.id,
        feed_id: id,
      });
      await this.likeRepository.save(like);
      feed.likes_count += 1;
      await this.feedRepository.save(feed);
      return { success: true, message: 'Liked', liked: true };
    }
  }

  async delete(id: number, user: User) {
    const feed = await this.feedRepository.findOne({ where: { id } });

    if (!feed) {
      throw new NotFoundException('Feed not found');
    }

    if (feed.user_id !== user.id) {
      throw new ForbiddenException('You can only delete your own feeds');
    }

    await this.feedRepository.remove(feed);

    return {
      success: true,
      message: 'Feed deleted successfully',
    };
  }

  private formatFeed(feed: Feed, userId: number) {
    return {
      id: feed.id,
      content: feed.content,
      content_img: feed.content_img
        ? Buffer.from(feed.content_img).toString('base64')
        : null,
      likes_count: feed.likes_count,
      feed_type: feed.feed_type,
      created_at: feed.created_at,
      user: {
        id: feed.user.id,
        name: feed.user.name,
        profile_pic: feed.user.profile_pic
          ? Buffer.from(feed.user.profile_pic).toString('base64')
          : null,
      },
      is_liked: feed.likes?.some((like) => like.user_id === userId) || false,
    };
  }
}

