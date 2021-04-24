import { OAuthProvider } from '@app/auth';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Column,
  Unique,
} from 'typeorm';
import { IOAuthTicketEntity } from '../interfaces';
import { UserEntity } from './user.entity';

/**
 * OAuth Ticket Entity
 */
@Entity({ name: 'oauth_tickets' })
@Unique(['provider', 'user'])
export class OAuthTicketEntity implements IOAuthTicketEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Object.values(OAuthProvider) })
  provider: OAuthProvider;

  @Column({ type: 'bytea', nullable: false })
  encryptedTicketData: Buffer;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: string;

  @DeleteDateColumn({ type: 'timestamp with time zone' })
  removedAt: string;
}
