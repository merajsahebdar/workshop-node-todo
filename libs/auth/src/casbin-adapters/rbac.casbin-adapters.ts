import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { BatchAdapter, FilteredAdapter, Helper, Model } from 'casbin';
import { EntityManager, FindConditions } from 'typeorm';
import { CasbinRbacPolicyEntity } from '../entities';
import { CasbinRbacPoliciesRepository } from '../repositories';

/**
 * RBAC Casbin Adapter
 */
@Injectable()
export class RbacCasbinAdapter implements FilteredAdapter, BatchAdapter {
  /**
   * Is Filtered
   */
  private filtered = false;

  /**
   * Constructor
   *
   * @param connection
   * @param policies
   */
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    @InjectRepository(CasbinRbacPolicyEntity)
    private policies: CasbinRbacPoliciesRepository,
  ) {}

  /**
   * Whether the current policy is filtered or not.
   *
   * @returns
   */
  isFiltered(): boolean {
    return this.filtered;
  }

  /**
   * Load Policy Line
   *
   * @param policy
   * @param model
   * @returns
   */
  private loadPolicyLine(line: CasbinRbacPolicyEntity, model: Model) {
    const value =
      line.ptype +
      ', ' +
      [line.v0, line.v1, line.v2, line.v3, line.v4, line.v5]
        .filter((n) => n)
        .join(', ');

    Helper.loadPolicyLine(value, model);
  }

  /**
   * Load Policy
   *
   * @param model
   * @returns
   */
  async loadPolicy(model: Model): Promise<void> {
    const lines = await this.policies.find();

    for (const line of lines) {
      this.loadPolicyLine(line, model);
    }
  }

  /**
   * Load Filtered Policy
   *
   * @param model
   * @param filter
   * @returns
   */
  async loadFilteredPolicy(
    model: Model,
    filter: FindConditions<CasbinRbacPolicyEntity>,
  ): Promise<void> {
    const lines = await this.policies.find({
      where: filter,
      order: { updatedAt: 'DESC' },
    });

    for (const line of lines) {
      this.loadPolicyLine(line, model);
    }

    this.filtered = true;
  }

  /**
   * Create an instance of casbin policy entity.
   *
   * @param ptype
   * @param policy
   * @returns
   */
  private createPolicyLine(
    ptype: string,
    policy: string[],
  ): CasbinRbacPolicyEntity {
    const line = this.policies.create();

    line.ptype = ptype;

    if (policy.length > 0) {
      line.v0 = policy[0];
    }

    if (policy.length > 1) {
      line.v1 = policy[1];
    }

    if (policy.length > 2) {
      line.v2 = policy[2];
    }

    if (policy.length > 3) {
      line.v3 = policy[3];
    }

    if (policy.length > 4) {
      line.v4 = policy[4];
    }

    if (policy.length > 5) {
      line.v5 = policy[5];
    }

    return line;
  }

  /**
   * Save Policy
   *
   * @param model
   * @returns
   */
  async savePolicy(model: Model): Promise<boolean> {
    await this.policies.clear();

    const lines: CasbinRbacPolicyEntity[] = [];

    let astMap = model.model.get('p');
    if (astMap) {
      for (const [ptype, ast] of astMap) {
        for (const policy of ast.policy) {
          const line = this.createPolicyLine(ptype, policy);
          lines.push(line);
        }
      }
    }

    astMap = model.model.get('g');
    if (astMap) {
      for (const [ptype, ast] of astMap) {
        for (const policy of ast.policy) {
          const line = this.createPolicyLine(ptype, policy);
          lines.push(line);
        }
      }
    }

    await this.entityManager.transaction(async (entityManager) => {
      await entityManager.save(lines);
    });

    return true;
  }

  /**
   * Add Policy
   *
   * @param sec
   * @param ptype
   * @param policy
   * @returns
   */
  async addPolicy(_: string, ptype: string, policy: string[]): Promise<void> {
    const line = this.createPolicyLine(ptype, policy);
    await this.policies.save(line);
  }

  /**
   * Add Policies
   *
   * @param sec
   * @param ptype
   * @param policies
   * @returns
   */
  async addPolicies(
    _: string,
    ptype: string,
    policies: string[][],
  ): Promise<void> {
    const lines: CasbinRbacPolicyEntity[] = [];
    for (const policy of policies) {
      const line = this.createPolicyLine(ptype, policy);
      lines.push(line);
    }

    await this.entityManager.transaction(async (entityManager) => {
      await entityManager.save(lines);
    });
  }

  /**
   * Remove Policy
   *
   * @param sec
   * @param ptype
   * @param policy
   * @returns
   */
  async removePolicy(
    _: string,
    ptype: string,
    policy: string[],
  ): Promise<void> {
    const line = this.createPolicyLine(ptype, policy);
    await this.policies.delete(line);
  }

  /**
   * Remove Policies
   *
   * @param sec
   * @param ptype
   * @param policies
   * @returns
   */
  public async removePolicies(
    _: string,
    ptype: string,
    policies: string[][],
  ): Promise<void> {
    await this.entityManager.transaction(async (entityManager) => {
      for (const policy of policies) {
        const line = this.createPolicyLine(ptype, policy);
        await entityManager.delete(CasbinRbacPolicyEntity, line);
      }
    });
  }

  /**
   * Remove Filtered Policy
   *
   * @param sec
   * @param ptype
   * @param fieldIndex
   * @param fieldValues
   * @returns
   */
  async removeFilteredPolicy(
    _: string,
    ptype: string,
    fieldIndex: number,
    ...fieldValues: string[]
  ): Promise<void> {
    const line = this.policies.create();

    line.ptype = ptype;

    if (fieldIndex <= 0 && 0 < fieldIndex + fieldValues.length) {
      line.v0 = fieldValues[0 - fieldIndex];
    }

    if (fieldIndex <= 1 && 1 < fieldIndex + fieldValues.length) {
      line.v1 = fieldValues[1 - fieldIndex];
    }

    if (fieldIndex <= 2 && 2 < fieldIndex + fieldValues.length) {
      line.v2 = fieldValues[2 - fieldIndex];
    }

    if (fieldIndex <= 3 && 3 < fieldIndex + fieldValues.length) {
      line.v3 = fieldValues[3 - fieldIndex];
    }

    if (fieldIndex <= 4 && 4 < fieldIndex + fieldValues.length) {
      line.v4 = fieldValues[4 - fieldIndex];
    }

    if (fieldIndex <= 5 && 5 < fieldIndex + fieldValues.length) {
      line.v5 = fieldValues[5 - fieldIndex];
    }

    await this.policies.delete(line);
  }
}
