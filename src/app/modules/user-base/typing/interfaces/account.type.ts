import { INodeType } from './node.type';

/**
 * Account Type Interface
 */
export interface IAccountType extends INodeType {
  userId: string;
  forename: string;
  surname: string;
}
