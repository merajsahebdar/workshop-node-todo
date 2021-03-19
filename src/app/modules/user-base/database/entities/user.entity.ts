import * as bcrypt from 'bcryptjs';
import {
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

/**
 * User Entity
 */
@Entity('users')
@Unique('UQ_EMAIL', ['email'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  email: string;

  @Column('varchar')
  password: string;

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
   * Compare Password
   *
   * @param {string} passwordToCompare
   * @returns {Promise<boolean>}
   */
  async comparePassword(passwordToCompare: string): Promise<boolean> {
    return bcrypt.compare(passwordToCompare, this.password);
  }

  /**
   * Hash password before any update.
   *
   * @returns
   */
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, await bcrypt.genSalt());
    }
  }
}
