import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Giveaway } from './giveaway.entity';
import { Feed } from './feed.entity';
import { Message } from './message.entity';
import { Notification } from './notification.entity';
import { Like } from './like.entity';

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
  ORGANIZATION = 'organization',
}

export enum UserType {
  REGULAR = 'regular',
  ORGANIZATION = 'organization',
}

export enum UserStatus {
  ALLOWED = 'allowed',
  PENDING = 'pending',
  BLOCKED = 'blocked',
}

@Entity('login')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'varchar', length: 60, unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({
    type: 'enum',
    enum: UserGender,
    nullable: true,
  })
  gender: UserGender;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.REGULAR,
  })
  user_type: UserType;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @Column({ type: 'longblob', nullable: true })
  profile_pic: Buffer;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Giveaway, (giveaway) => giveaway.user)
  giveaways: Giveaway[];

  @OneToMany(() => Feed, (feed) => feed.user)
  feeds: Feed[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];

  @OneToMany(() => Notification, (notification) => notification.poster)
  postedNotifications: Notification[];

  @OneToMany(() => Notification, (notification) => notification.requester)
  receivedNotifications: Notification[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
}

