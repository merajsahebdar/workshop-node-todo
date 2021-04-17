import { extendMetadata } from '@app/common';
import { RBAC_PERMISSIONS_METADATA } from '../contants';
import { PermissionCreator, RbacPermission } from '../types';

/**
 * Add new rbac permissions.
 *
 * @param {RbacPermission[]} perms
 * @returns
 */
export function UsePermissions(
  permission: PermissionCreator<RbacPermission>,
  ...permissions: PermissionCreator<RbacPermission>[]
): MethodDecorator {
  return (
    target: any,
    __?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (descriptor) {
      extendMetadata(
        RBAC_PERMISSIONS_METADATA,
        permissions.concat(permission),
        descriptor.value,
      );
      return descriptor;
    }

    extendMetadata(
      RBAC_PERMISSIONS_METADATA,
      permissions.concat(permission),
      target,
    );
    return target;
  };
}
