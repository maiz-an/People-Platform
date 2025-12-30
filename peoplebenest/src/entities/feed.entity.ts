import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Like } from './like.entity';

export enum FeedType {
  COMMUNITY_FEED = 'community_feed',
  DISCUSSION = 'discussion',
  EVENT = 'event',
  MEETUP = 'meetup',
}

@Entity('feeds')
export class Feed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => User, (user) => user.feeds)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'longblob', nullable: true })
  content_img: Buffer;

  @Column({ type: 'int', default: 0 })
  likes_count: number;

  @Column({
    type: 'enum',
    enum: FeedType,
    default: FeedType.COMMUNITY_FEED,
  })
  feed_type: FeedType;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Like, (like) => like.feed)
  likes: Like[];
}

