import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateOrganizationStatusDto } from './dto/update-organization-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UserStatus } from '../entities/user.entity';
import { OrganizationStatus } from '../entities/organization.entity';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  async getUsers(@Query('status') status?: UserStatus) {
    return this.adminService.getUsers(status);
  }

  @Put('users/:id/status')
  @ApiOperation({ summary: 'Update user status' })
  async updateUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateUserStatus(id, updateStatusDto);
  }

  @Get('organizations')
  @ApiOperation({ summary: 'Get all organizations' })
  async getOrganizations(@Query('status') status?: OrganizationStatus) {
    return this.adminService.getOrganizations(status);
  }

  @Put('organizations/:id/status')
  @ApiOperation({ summary: 'Update organization status' })
  async updateOrganizationStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateOrganizationStatusDto,
  ) {
    return this.adminService.updateOrganizationStatus(id, updateStatusDto);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get analytics data' })
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @Get('giveaways')
  @ApiOperation({ summary: 'Get all giveaways' })
  async getGiveaways(@Query('status') status?: string) {
    return this.adminService.getGiveaways(status);
  }
}

