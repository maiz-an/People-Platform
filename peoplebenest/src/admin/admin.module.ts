import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { Giveaway } from '../entities/giveaway.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization, Giveaway])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

