import { INodeEntity, INodeType } from '@app/common';

/**
 * Account Type Interface
 */
export interface IAccountType extends INodeType {
  forename: string;
  surname: string;
}

/**
 * Account Entity Interface
 */
export interface IAccountEntity extends INodeEntity, IAccountType {
  userId: string;
}
