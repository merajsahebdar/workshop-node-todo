import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { IRefreshTokenType } from '../../typing';

/**
 * Refresh Token Entity
 */
@Entity({ name: 'refresh_tokens' })
export class RefreshTokenEntity implements IRefreshTokenType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('varchar')
  userAgent: string;

  @Column('varchar')
  clientIp: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: string;

  @DeleteDateColumn({ type: 'timestamp with time zone' })
  removedAt: string;
}
