import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { IAccountEntity } from '../interfaces';
import { UserEntity } from './user.entity';

/**
 * Account Entity
 */
@Entity('accounts')
@Unique(['user'])
export class AccountEntity implements IAccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;

  @Column({ type: 'varchar', nullable: true })
  forename?: string;

  @Column({ type: 'varchar', nullable: true })
  surname?: string;

  @Column({ type: 'varchar', nullable: true })
  nickname?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: string;

  @DeleteDateColumn({ type: 'timestamp with time zone' })
  removedAt: string;
}
