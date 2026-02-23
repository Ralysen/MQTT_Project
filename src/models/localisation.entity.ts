import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Device } from './device.entity';

@Entity('localisation')
@Index('idx_localisation_device_recorded_at', ['device', 'recordedAt'])
export class Localisation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude!: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude!: number;

  @Column({ type: 'decimal', precision: 7, scale: 2, nullable: true })
  altitude!: number | null;

  @Index('idx_localisation_recorded_at')
  @Column({ name: 'recorded_at', type: 'timestamptz' })
  recordedAt!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => Device, (device) => device.localisations, { nullable: false })
  @JoinColumn({ name: 'device_id' })
  device!: Device;
}
