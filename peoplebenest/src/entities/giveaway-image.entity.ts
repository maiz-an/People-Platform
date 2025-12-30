import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Giveaway } from './giveaway.entity';

@Entity('free_food_images')
export class GiveawayImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'giveaway_id' })
  giveaway_id: number;

  @ManyToOne(() => Giveaway, (giveaway) => giveaway.images)
  @JoinColumn({ name: 'giveaway_id' })
  giveaway: Giveaway;

  @Column({ type: 'varchar', length: 255 })
  image_path: string;
}

