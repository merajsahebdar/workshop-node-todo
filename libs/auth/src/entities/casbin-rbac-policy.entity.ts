import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Casbin Rbac Policy Entity
 */
@Entity('casbin_rbac_policies')
export class CasbinRbacPolicyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  ptype: string;

  @Column({ nullable: true, type: 'varchar' })
  v0: string;

  @Column({ nullable: true, type: 'varchar' })
  v1: string;

  @Column({ nullable: true, type: 'varchar' })
  v2: string;

  @Column({ nullable: true, type: 'varchar' })
  v3: string;

  @Column({ nullable: true, type: 'varchar' })
  v4: string;

  @Column({ nullable: true, type: 'varchar' })
  v5: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: string;
}
