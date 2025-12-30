import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Feed } from './feed.entity';

@Entity('likes')
@Unique(['user_id', 'feed_id'])
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'feed_id' })
  feed_id: number;

  @ManyToOne(() => Feed, (feed) => feed.likes)
  @JoinColumn({ name: 'feed_id' })
  feed: Feed;
}

