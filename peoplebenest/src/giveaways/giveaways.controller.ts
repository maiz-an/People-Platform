import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GiveawaysService } from './giveaways.service';
import { CreateGiveawayDto } from './dto/create-giveaway.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GiveawayCategory } from '../entities/giveaway.entity';

@ApiTags('Giveaways')
@Controller('giveaways')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GiveawaysController {
  constructor(private readonly giveawaysService: GiveawaysService) {}

  @Get()
  @ApiOperation({ summary: 'Get all giveaways' })
  async findAll(@Request() req, @Query('category') category?: GiveawayCategory) {
    const giveaways = await this.giveawaysService.findAll(req.user, category);
    return {
      success: true,
      data: giveaways,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new giveaway' })
  async create(@Body() createGiveawayDto: CreateGiveawayDto, @Request() req) {
    return this.giveawaysService.create(createGiveawayDto, req.user);
  }

  @Get('homeless-requests')
  @ApiOperation({ summary: 'Get homeless support requests' })
  async homelessRequests(@Request() req) {
    const requests = await this.giveawaysService.homelessRequests(req.user);
    return {
      success: true,
      data: requests,
    };
  }

  @Post('homeless-requests')
  @ApiOperation({ summary: 'Create homeless support request' })
  async createHomelessRequest(@Body() createGiveawayDto: CreateGiveawayDto, @Request() req) {
    createGiveawayDto.category = GiveawayCategory.HOMELESS;
    return this.giveawaysService.create(createGiveawayDto, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get giveaway details' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.giveawaysService.findOne(id, req.user);
  }

  @Post(':id/request')
  @ApiOperation({ summary: 'Request an item' })
  async requestItem(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.giveawaysService.requestItem(id, req.user);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update giveaway status' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
    @Request() req,
  ) {
    return this.giveawaysService.updateStatus(id, updateStatusDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a giveaway' })
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.giveawaysService.delete(id, req.user);
  }
}

