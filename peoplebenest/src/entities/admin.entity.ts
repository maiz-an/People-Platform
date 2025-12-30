import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn({ name: 'Aid' })
  Aid: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'varchar', length: 60, unique: true, nullable: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text' })
  location: string;

  @Column({ type: 'text' })
  address: string;
}

