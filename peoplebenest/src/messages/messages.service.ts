import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { User } from '../entities/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getChatList(user: User) {
    // Get all users with whom the current user has exchanged messages
    // Get distinct user IDs from messages
    const sentMessages = await this.messageRepository.find({
      where: { sender_id: user.id },
      select: ['receiver_id'],
    });

    const receivedMessages = await this.messageRepository.find({
      where: { receiver_id: user.id },
      select: ['sender_id'],
    });

    const otherUserIds = [
      ...new Set([
        ...sentMessages.map((m) => m.receiver_id),
        ...receivedMessages.map((m) => m.sender_id),
      ]),
    ];

    const otherUserIds = userIds.map((u) => u.other_user_id);

    if (otherUserIds.length === 0) {
      return [];
    }

    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...ids)', { ids: otherUserIds })
      .getMany();

    const chatList = await Promise.all(
      users.map(async (otherUser) => {
        const lastMessage = await this.messageRepository.findOne({
          where: [
            { sender_id: user.id, receiver_id: otherUser.id },
            { sender_id: otherUser.id, receiver_id: user.id },
          ],
          order: { timestamp: 'DESC' },
        });

        const unreadCount = await this.messageRepository.count({
          where: {
            sender_id: otherUser.id,
            receiver_id: user.id,
            is_read: false,
          },
        });

        return {
          id: otherUser.id,
          name: otherUser.name,
          profile_pic: otherUser.profile_pic
            ? Buffer.from(otherUser.profile_pic).toString('base64')
            : null,
          last_message: lastMessage?.message || null,
          last_message_time: lastMessage?.timestamp || null,
          is_sender: lastMessage?.sender_id === user.id,
          unread_count: unreadCount,
        };
      }),
    );

    return chatList.sort((a, b) => {
      if (!a.last_message_time) return 1;
      if (!b.last_message_time) return -1;
      return new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime();
    });
  }

  async getMessages(userId: number, currentUser: User) {
    const otherUser = await this.userRepository.findOne({ where: { id: userId } });

    if (!otherUser) {
      throw new NotFoundException('User not found');
    }

    // Mark messages as read
    await this.messageRepository.update(
      {
        sender_id: userId,
        receiver_id: currentUser.id,
        is_read: false,
      },
      { is_read: true },
    );

    const messages = await this.messageRepository.find({
      where: [
        { sender_id: currentUser.id, receiver_id: userId },
        { sender_id: userId, receiver_id: currentUser.id },
      ],
      order: { timestamp: 'ASC' },
      relations: ['sender', 'receiver'],
    });

    return messages.map((msg) => ({
      id: msg.id,
      message: msg.message,
      sender_id: msg.sender_id,
      receiver_id: msg.receiver_id,
      is_read: msg.is_read,
      timestamp: msg.timestamp,
      is_sender: msg.sender_id === currentUser.id,
    }));
  }

  async create(createMessageDto: CreateMessageDto, user: User) {
    const receiver = await this.userRepository.findOne({
      where: { id: createMessageDto.receiver_id },
    });

    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }

    const message = this.messageRepository.create({
      sender_id: user.id,
      receiver_id: createMessageDto.receiver_id,
      message: createMessageDto.message,
      is_read: false,
    });

    const savedMessage = await this.messageRepository.save(message);

    return {
      success: true,
      message: 'Message sent successfully',
      data: {
        id: savedMessage.id,
        message: savedMessage.message,
        sender_id: savedMessage.sender_id,
        receiver_id: savedMessage.receiver_id,
        is_read: savedMessage.is_read,
        timestamp: savedMessage.timestamp,
      },
    };
  }

  async markAsRead(messageId: number, user: User) {
    const message = await this.messageRepository.findOne({
      where: { id: messageId, receiver_id: user.id },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    message.is_read = true;
    await this.messageRepository.save(message);

    return {
      success: true,
      message: 'Message marked as read',
    };
  }

  async getUnreadCount(user: User) {
    const count = await this.messageRepository.count({
      where: {
        receiver_id: user.id,
        is_read: false,
      },
    });

    return {
      success: true,
      data: {
        unread_count: count,
      },
    };
  }
}

