import * as bcrypt from 'bcryptjs';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IUserEntity, IUserType } from '../interfaces';
import { AccountEntity } from './account.entity';
import { EmailEntity } from './email.entity';
import { RefreshTokenEntity } from './refresh-token.entity';

/**
 * User Entity
 */
@Entity('users')
export class UserEntity implements IUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  password?: string;

  private cachedPassword?: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  isActivated: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  isBlocked: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: string;

  @DeleteDateColumn({ type: 'timestamp with time zone' })
  removedAt: string;

  @OneToMany(() => EmailEntity, (email) => email.user)
  emails: EmailEntity[];

  @OneToMany(() => RefreshTokenEntity, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshTokenEntity[];

  @OneToOne(() => AccountEntity)
  account: AccountEntity;

  /**
   * Convert the instance to a plain user type object.
   *
   * @returns
   */
  toType(): IUserType {
    return {
      id: this.id,
      emails: this.emails,
      isActivated: this.isActivated,
      isBlocked: this.isBlocked,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      removedAt: this.removedAt,
    };
  }

  /**
   * Compare Password
   *
   * @param {string} passwordToCompare
   * @returns {Promise<boolean>}
   */
  async comparePassword(passwordToCompare: string): Promise<boolean> {
    if (this.password) {
      return bcrypt.compare(passwordToCompare, this.password);
    }

    return false;
  }

  /**
   * Cache password to avoid rehashing on updates.
   */
  @AfterLoad()
  cachePassword() {
    if (this.password) {
      this.cachedPassword = this.password;
    }
  }

  /**
   * Hash password before any update.
   *
   * @returns
   */
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password && this.cachedPassword !== this.password) {
      this.password = await bcrypt.hash(this.password, await bcrypt.genSalt());
    }
  }
}
