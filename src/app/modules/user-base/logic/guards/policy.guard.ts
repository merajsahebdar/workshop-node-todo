import {
  ExecutionContext,
  CanActivate,
  Inject,
  Type,
  mixin,
} from '@nestjs/common';
import memoize from 'lodash.memoize';
import { every } from '../../../../utils/async-array.util';
import { getArgs } from '../../../../utils/get-args.util';
import { IPerm } from '../../typing/interfaces/perm.interface';
import { IPolicyBuilder } from '../../typing/interfaces/policy-builder.interface';
import { IPolicyHandler } from '../../typing/interfaces/policy-handler.interface';
import { IPolicy } from '../../typing/interfaces/policy.interface';
import { IRule } from '../../typing/interfaces/rule.interface';
import { Policy } from '../factories/policy.factory';

/**
 * Policy Guard Interface
 */
export type IPolicyGuard = CanActivate;

/**
 * Policy Guard
 *
 * @returns
 */
export const PolicyGuard: (
  PolicyBuilderClass: {
    new (...args: any[]): IPolicyBuilder;
  },
  handler: IPolicyHandler,
  ...moreHandlers: IPolicyHandler[]
) => Type<IPolicyGuard> = memoize(createPolicyGuard);

/**
 * Create Policy Guard
 *
 * @returns
 */
function createPolicyGuard(
  PolicyBuilderClass: {
    new (...args: any[]): IPolicyBuilder;
  },
  handler: IPolicyHandler,
  ...moreHandlers: IPolicyHandler[]
): Type<IPolicyGuard> {
  const handlers = [handler, ...(moreHandlers ?? [])];

  class MixinPolicyGuard implements IPolicyGuard {
    @Inject(PolicyBuilderClass)
    private builder: IPolicyBuilder;

    @Inject(Policy)
    private policy: IPolicy;

    /**
     * Can Activate
     *
     * @param {ExecutionContext} context
     * @returns
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const args = getArgs(context);

      // Builder Rules
      const rules: IRule[] = [];

      this.builder.build({
        context,
        can: (action, subject) => {
          rules.push({
            action,
            subject,
          });
        },
      });

      return await every(handlers, async (handler) => {
        const perms: IPerm[] = [];

        handler({
          args,
          can: (action, subject) => {
            perms.push({ action, subject });
          },
        });

        return await this.policy.check(rules, perms);
      });
    }
  }

  return mixin(MixinPolicyGuard);
}
