import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get chat list' })
  async getChatList(@Request() req) {
    const chats = await this.messagesService.getChatList(req.user);
    return {
      success: true,
      data: { users: chats },
    };
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread messages count' })
  async getUnreadCount(@Request() req) {
    return this.messagesService.getUnreadCount(req.user);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get messages with a user' })
  async getMessages(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req,
  ) {
    const messages = await this.messagesService.getMessages(userId, req.user);
    return {
      success: true,
      data: { messages },
    };
  }

  @Post()
  @ApiOperation({ summary: 'Send a message' })
  async create(@Body() createMessageDto: CreateMessageDto, @Request() req) {
    return this.messagesService.create(createMessageDto, req.user);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark message as read' })
  async markAsRead(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.messagesService.markAsRead(id, req.user);
  }
}

