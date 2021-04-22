import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { IRefreshTokenEntity } from '../interfaces';
import { UserEntity } from './user.entity';

/**
 * Refresh Token Entity
 */
@Entity({ name: 'refresh_tokens' })
export class RefreshTokenEntity implements IRefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  userAgent: string;

  @Column({ type: 'varchar' })
  clientIp: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: string;

  @DeleteDateColumn({ type: 'timestamp with time zone' })
  removedAt: string;
}
