import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getProfile(user: User) {
    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        user_type: user.user_type,
        status: user.status,
        profile_pic: user.profile_pic
          ? Buffer.from(user.profile_pic).toString('base64')
          : null,
        latitude: user.latitude,
        longitude: user.longitude,
      },
    };
  }

  async updateProfile(updateProfileDto: UpdateProfileDto, user: User) {
    if (updateProfileDto.name) user.name = updateProfileDto.name;
    if (updateProfileDto.gender) user.gender = updateProfileDto.gender;
    if (updateProfileDto.latitude !== undefined) user.latitude = updateProfileDto.latitude;
    if (updateProfileDto.longitude !== undefined) user.longitude = updateProfileDto.longitude;

    await this.userRepository.save(user);

    return this.getProfile(user);
  }

  async updatePhoto(profilePic: string, user: User) {
    const imageBuffer = Buffer.from(profilePic, 'base64');
    user.profile_pic = imageBuffer;
    await this.userRepository.save(user);

    return {
      success: true,
      message: 'Profile picture updated successfully',
    };
  }

  async getDashboard(user: User) {
    // Get user's giveaways count
    const giveawaysCount = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.giveaways', 'giveaway')
      .where('user.id = :userId', { userId: user.id })
      .select('COUNT(giveaway.id)', 'count')
      .getRawOne();

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        giveaways_count: parseInt(giveawaysCount?.count || '0'),
      },
    };
  }
}

