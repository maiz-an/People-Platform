import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@Request() req) {
    return this.profileService.getProfile(req.user);
  }

  @Put()
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto, @Request() req) {
    return this.profileService.updateProfile(updateProfileDto, req.user);
  }

  @Post('photo')
  @ApiOperation({ summary: 'Update profile picture' })
  async updatePhoto(@Body() updatePhotoDto: UpdatePhotoDto, @Request() req) {
    return this.profileService.updatePhoto(updatePhotoDto.profile_pic, req.user);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get user dashboard' })
  async getDashboard(@Request() req) {
    return this.profileService.getDashboard(req.user);
  }
}

