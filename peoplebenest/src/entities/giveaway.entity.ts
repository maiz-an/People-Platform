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
import { GiveawayImage } from './giveaway-image.entity';
import { Notification } from './notification.entity';

export enum GiveawayStatus {
  NORMAL = 'normal',
  HOLDED = 'holded',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum GiveawayCategory {
  FOOD = 'food',
  NON_FOOD = 'non-food',
  HOMELESS = 'homeless',
}

export enum ReportCategory {
  SPAM = 'Spam',
  INAPPROPRIATE_CONTENT = 'Inappropriate Content',
  FRAUD_OR_SCAM = 'Fraud or Scam',
  EXPIRED_OR_INVALID = 'Expired or Invalid',
  SAFETY_CONCERNS = 'Safety Concerns',
  WRONG_CATEGORY = 'Wrong Category',
  OFFENSIVE_TO_HOMELESS = 'Offensive to Homeless',
  OTHER = 'Other',
}

@Entity('free_food')
export class Giveaway {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => User, (user) => user.giveaways)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  food_title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  quantity: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  pickup_time: string;

  @Column({ type: 'text', nullable: true })
  pickup_instruction: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ type: 'datetime', nullable: true })
  expiration_time: Date;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'enum',
    enum: GiveawayStatus,
    default: GiveawayStatus.NORMAL,
  })
  status: GiveawayStatus;

  @Column({
    type: 'enum',
    enum: GiveawayCategory,
    default: GiveawayCategory.FOOD,
  })
  category: GiveawayCategory;

  @Column({
    type: 'enum',
    enum: ReportCategory,
    nullable: true,
  })
  report_category: ReportCategory;

  @OneToMany(() => GiveawayImage, (image) => image.giveaway)
  images: GiveawayImage[];

  @OneToMany(() => Notification, (notification) => notification.foodItem)
  notifications: Notification[];
}

