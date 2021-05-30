// Rbac Role
export type RbacRole = 'root' | 'admin' | 'editor' | 'subscriber';

// Rbac Action
export type RbacAction = 'create' | 'read' | 'update' | 'remove' | '*';

// Role based Access Control Permission
// Schema: feature, [feature, action]
export type RbacPermission = [string, RbacAction] | string;

// Permission Creator
export type PermissionCreator<T> = (args: any) => T;
