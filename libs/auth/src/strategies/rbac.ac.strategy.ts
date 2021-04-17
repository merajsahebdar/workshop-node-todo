import { every, getArgs, getRequest } from '@app/common';
import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Enforcer } from 'casbin';
import { Like } from 'typeorm';
import {
  RBAC_ENFORCER,
  RBAC_PERMISSIONS_METADATA,
  REQUEST_AUTHORIZE_PROPERTY_KEY,
} from '../contants';
import { IAcStrategy } from '../interfaces';
import { PermissionCreator, RbacPermission } from '../types';

/**
 * Role based Access Control Strategy
 */
@Injectable()
export class RbacStrategy implements IAcStrategy {
  /**
   * Enforcer
   */
  @Inject(RBAC_ENFORCER)
  private enforcer: Enforcer;

  /**
   * Constructor
   *
   * @param {Reflector} reflector
   */
  constructor(private reflector: Reflector) {}

  /**
   * Check whether the authorized user has permission to continue or not.
   *
   * @param {ExecutionContext} context
   * @returns
   */
  async hasPermission(context: ExecutionContext): Promise<boolean> {
    const creators: PermissionCreator<RbacPermission>[] = this.reflector.getAllAndOverride(
      RBAC_PERMISSIONS_METADATA,
      [context.getClass(), context.getHandler()],
    );

    const request = getRequest(context);

    const authorizedUser = request[REQUEST_AUTHORIZE_PROPERTY_KEY];

    if (authorizedUser) {
      const args = getArgs(context);
      const userId = authorizedUser.id;

      await this.enforcer.loadFilteredPolicy([
        { ptype: 'p', v0: Like('role:%') },
        { ptype: 'g', v0: Like('role:%') },
        { ptype: 'p', v0: `user:${userId}` },
        { ptype: 'g', v0: `user:${userId}` },
      ]);

      return every(creators, async (creator) => {
        const permission = creator(args);

        if (typeof permission === 'string') {
          return this.enforcer.enforce(`user:${userId}`, permission, '*');
        }

        return this.enforcer.enforce(
          `user:${userId}`,
          permission[0],
          permission[1],
        );
      });
    }

    return false;
  }
}
