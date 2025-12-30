import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Giveaway } from './giveaway.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'poster_id' })
  poster_id: number;

  @ManyToOne(() => User, (user) => user.postedNotifications)
  @JoinColumn({ name: 'poster_id' })
  poster: User;

  @Column({ name: 'requester_id' })
  requester_id: number;

  @ManyToOne(() => User, (user) => user.receivedNotifications)
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @Column({ name: 'food_id', nullable: true })
  food_id: number;

  @ManyToOne(() => Giveaway, (giveaway) => giveaway.notifications, { nullable: true })
  @JoinColumn({ name: 'food_id' })
  foodItem: Giveaway;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'boolean', default: false })
  is_read: boolean;

  @CreateDateColumn()
  created_at: Date;
}

