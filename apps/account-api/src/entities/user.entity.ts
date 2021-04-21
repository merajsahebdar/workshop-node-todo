import * as bcrypt from 'bcryptjs';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { IUserEntity, IUserType } from '../interfaces';

/**
 * User Entity
 */
@Entity('users')
@Unique('UQ_EMAIL', ['email'])
export class UserEntity implements IUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  email: string;

  @Column('varchar')
  password: string;

  private cachedPassword: string;

  @Column('boolean', { nullable: false, default: true })
  isActivated: boolean;

  @Column('boolean', { nullable: false, default: false })
  isBlocked: boolean;

  @Column('boolean', { nullable: false, default: false })
  isVerified: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: string;

  @DeleteDateColumn({ type: 'timestamp with time zone' })
  removedAt: string;

  /**
   * Convert the instance to a plain user type object.
   *
   * @returns
   */
  toType(): IUserType {
    return {
      id: this.id,
      email: this.email,
      isActivated: this.isActivated,
      isBlocked: this.isBlocked,
      isVerified: this.isVerified,
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
    return bcrypt.compare(passwordToCompare, this.password);
  }

  /**
   * Cache password to avoid rehashing on updates.
   */
  @AfterLoad()
  cachePassword() {
    this.cachedPassword = this.password;
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
