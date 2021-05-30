import { Inject } from '@nestjs/common';
import { Enforcer } from 'casbin';
import { RBAC_ENFORCER } from '../contants';

/**
 * Casbin Policies Service
 */
export class CasbinPoliciesService {
  /**
   * Constructor
   *
   * @param {Enforcer} enforcer
   */
  constructor(@Inject(RBAC_ENFORCER) private enforcer: Enforcer) {}

  /**
   * Create Policies
   *
   * @param {string} ptype
   * @param {string[][]} policies
   * @returns
   */
  async createPolicies(ptype: string, policies: string[][]): Promise<void> {
    await this.enforcer.addNamedPolicies(ptype, policies);
  }
}
