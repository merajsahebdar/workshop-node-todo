import {
  ExecutionContext,
  CanActivate,
  Inject,
  Type,
  mixin,
} from '@nestjs/common';
import memoize from 'lodash.memoize';
import { every, getArgs } from '../../../../utils';
import {
  IPerm,
  IPolicyHandler,
  IPolicyBuilder,
  IPolicy,
  IRule,
} from '../../typing';
import { Policy } from '../factories';

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
