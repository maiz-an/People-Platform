import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

export enum OrganizationStatus {
  PENDING = 'pending',
  ALLOWED = 'allowed',
  BLOCKED = 'blocked',
}

@Entity('organization')
export class Organization {
  @PrimaryGeneratedColumn({ name: 'org_id' })
  org_id: number;

  @Column({ type: 'varchar', length: 255 })
  org_name: string;

  @Column({ type: 'varchar', length: 255 })
  org_type: string;

  @Column({ type: 'varchar', length: 255 })
  org_registration: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 25 })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'longblob' })
  proof_registration: Buffer;

  @Column({ type: 'text' })
  services: string;

  @Column({
    type: 'enum',
    enum: OrganizationStatus,
    default: OrganizationStatus.PENDING,
  })
  status: OrganizationStatus;

  @Column({ type: 'varchar', length: 255 })
  org_password: string;

  @Column({ type: 'longblob', nullable: true })
  profile_pic: Buffer;

  @Column({ type: 'boolean', default: false })
  profile_completed: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Employee, (employee) => employee.organization)
  employees: Employee[];
}

