import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Organization } from './organization.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'varchar', length: 100 })
  post: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  nic_passport: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'longblob' })
  photo: Buffer;

  @Column({ name: 'organization_id' })
  organization_id: number;

  @ManyToOne(() => Organization, (org) => org.employees)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}

