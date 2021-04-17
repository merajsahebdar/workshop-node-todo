import { Repository } from 'typeorm';
import { CasbinRbacPolicyEntity } from '../entities';

/**
 * Casbin Rbac Policies Repository
 */
export type CasbinRbacPoliciesRepository = Repository<CasbinRbacPolicyEntity>;
