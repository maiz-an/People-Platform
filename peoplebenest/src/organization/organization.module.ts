import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { Organization } from '../entities/organization.entity';
import { Employee } from '../entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Employee])],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}

