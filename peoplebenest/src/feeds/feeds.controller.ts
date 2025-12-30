import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FeedsService } from './feeds.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Feeds')
@Controller('feeds')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all feeds' })
  async findAll(@Request() req) {
    const feeds = await this.feedsService.findAll(req.user);
    return {
      success: true,
      data: feeds,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new feed' })
  async create(@Body() createFeedDto: CreateFeedDto, @Request() req) {
    return this.feedsService.create(createFeedDto, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get feed details' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.feedsService.findOne(id, req.user);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like or unlike a feed' })
  async like(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.feedsService.like(id, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a feed' })
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.feedsService.delete(id, req.user);
  }
}

