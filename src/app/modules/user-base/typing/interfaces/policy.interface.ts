import { IPerm } from './perm.interface';
import { IRule } from './rule.interface';
import { IPolicyBuilderSubject, IPolicySubject } from './subject.interface';

/**
 * Policy Interface
 */
export interface IPolicy<
  A extends string = string,
  S extends IPolicySubject = IPolicySubject,
  C extends IPolicyBuilderSubject = IPolicyBuilderSubject
> {
  /**
   * Check
   *
   * @param {IRule<A, C>[]} rules
   * @param {IPerm<A, S>[]} perms
   * @returns
   */
  check(rules: IRule<A, C>[], perms: IPerm<A, S>[]): Promise<boolean>;
}
