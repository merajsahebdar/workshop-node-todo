import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import {
  IPolicyBuilderSubject,
  IPolicySubject,
} from '../../typing/interfaces/subject.interface';
import { IPolicy } from '../../typing/interfaces/policy.interface';
import { IRule } from '../../typing/interfaces/rule.interface';
import { IPerm } from '../../typing/interfaces/perm.interface';
import { every } from '../../../../utils/async-array.util';
import { AppInputError } from '../../../../errors/app-input.error';

/**
 * Policy
 */
@Injectable()
export class Policy<
  A extends string = string,
  S extends IPolicySubject = IPolicySubject,
  C extends IPolicyBuilderSubject = IPolicyBuilderSubject
> implements IPolicy<A, S> {
  /**
   * Constructor
   *
   * @param {Connection} connection
   */
  constructor(@InjectConnection() private connection: Connection) {}

  /**
   * Check
   *
   * @param {IRule<A, C>[]} rules
   * @param {IPerm<A, S>[]} perms
   * @returns
   */
  async check(rules: IRule<A, C>[], perms: IPerm<A, S>[]): Promise<boolean> {
    return await every(perms, async (perm) => {
      return await this.checkPerm(rules, perm);
    });
  }

  /**
   * Check Single Permission
   *
   * @param {IRule<A, C>[]} rules
   * @param {IPerm<A, S>} perm
   * @returns
   */
  private async checkPerm(
    rules: IRule<A, C>[],
    perm: IPerm<A, S>,
  ): Promise<boolean> {
    const rule = this.pickRule(rules, perm);

    // There is no need for more checks with subject-less rules and perms.
    if (rule.subject === undefined && perm.subject === undefined) {
      return true;
    }

    const ruleSubject = rule.subject as C;
    const permSubject = perm.subject as S;

    try {
      switch (ruleSubject[0]) {
        case 'typeorm':
          const repository = this.connection.getRepository(ruleSubject[1]);
          const entity = await repository.findOneOrFail({
            where: permSubject[2],
          });
          return Object.keys(ruleSubject[2]).every(
            (key) => entity[key] === ruleSubject[2][key],
          );
      }
    } catch {
      throw new AppInputError('No resource found.');
    }
  }

  /**
   * Pick a relevant rule.
   *
   * @param {IRule<A, C>[]} rules
   * @param {IPerm<A, S>} perm
   * @returns
   */
  private pickRule(rules: IRule<A, C>[], perm: IPerm<A, S>): IRule<A, C> {
    for (const rule of rules) {
      if (rule.action === perm.action) {
        // Subject-less Permission
        if (rule.subject === undefined && perm.subject === undefined) {
          return rule;
        }

        // Permission with Subject
        if (
          rule.subject &&
          perm.subject &&
          this.compareSubjects(rule.subject, perm.subject)
        ) {
          return rule;
        }
      }
    }

    throw new Error('No relevant rule found to check permissions.');
  }

  /**
   * Check whether the rule's subject and the permission's subject
   *  are the same or not.
   *
   * @param {C} ruleSubject
   * @param {S} permSubject
   * @returns
   */
  private compareSubjects(
    [ruleType, ...ruleSubject]: C,
    [permType, ...permSubject]: S,
  ): boolean {
    if (ruleType === permType) {
      switch (ruleType) {
        case 'typeorm':
          if (ruleSubject[0] === permSubject[0]) {
            return true;
          }
          break;
      }
    }

    return false;
  }
}
