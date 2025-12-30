import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../entities/user.entity';
import { Organization, OrganizationStatus } from '../entities/organization.entity';
import { Giveaway } from '../entities/giveaway.entity';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateOrganizationStatusDto } from './dto/update-organization-status.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Giveaway)
    private giveawayRepository: Repository<Giveaway>,
  ) {}

  async getUsers(status?: UserStatus) {
    const query = this.userRepository.createQueryBuilder('user');

    if (status) {
      query.where('user.status = :status', { status });
    }

    const users = await query.getMany();

    return {
      success: true,
      data: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        user_type: user.user_type,
        status: user.status,
        created_at: user.created_at,
      })),
    };
  }

  async updateUserStatus(userId: number, updateStatusDto: UpdateUserStatusDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    user.status = updateStatusDto.status;
    await this.userRepository.save(user);

    return {
      success: true,
      message: 'User status updated successfully',
      data: {
        id: user.id,
        status: user.status,
      },
    };
  }

  async getOrganizations(status?: OrganizationStatus) {
    const query = this.organizationRepository.createQueryBuilder('org');

    if (status) {
      query.where('org.status = :status', { status });
    }

    const organizations = await query.getMany();

    return {
      success: true,
      data: organizations.map((org) => ({
        org_id: org.org_id,
        org_name: org.org_name,
        org_type: org.org_type,
        email: org.email,
        phone: org.phone,
        status: org.status,
        created_at: org.created_at,
      })),
    };
  }

  async updateOrganizationStatus(
    orgId: number,
    updateStatusDto: UpdateOrganizationStatusDto,
  ) {
    const organization = await this.organizationRepository.findOne({
      where: { org_id: orgId },
    });

    if (!organization) {
      throw new Error('Organization not found');
    }

    organization.status = updateStatusDto.status;
    await this.organizationRepository.save(organization);

    return {
      success: true,
      message: 'Organization status updated successfully',
      data: {
        org_id: organization.org_id,
        status: organization.status,
      },
    };
  }

  async getAnalytics() {
    const totalUsers = await this.userRepository.count();
    const totalOrganizations = await this.organizationRepository.count();
    const totalGiveaways = await this.giveawayRepository.count();
    const pendingUsers = await this.userRepository.count({
      where: { status: UserStatus.PENDING },
    });
    const pendingOrgs = await this.organizationRepository.count({
      where: { status: OrganizationStatus.PENDING },
    });

    return {
      success: true,
      data: {
        total_users: totalUsers,
        total_organizations: totalOrganizations,
        total_giveaways: totalGiveaways,
        pending_users: pendingUsers,
        pending_organizations: pendingOrgs,
      },
    };
  }

  async getGiveaways(status?: string) {
    const query = this.giveawayRepository.createQueryBuilder('giveaway');

    if (status) {
      query.where('giveaway.status = :status', { status });
    }

    const giveaways = await query
      .leftJoinAndSelect('giveaway.user', 'user')
      .orderBy('giveaway.created_at', 'DESC')
      .getMany();

    return {
      success: true,
      data: giveaways.map((g) => ({
        id: g.id,
        food_title: g.food_title,
        category: g.category,
        status: g.status,
        created_at: g.created_at,
        user: {
          id: g.user.id,
          name: g.user.name,
        },
      })),
    };
  }
}

