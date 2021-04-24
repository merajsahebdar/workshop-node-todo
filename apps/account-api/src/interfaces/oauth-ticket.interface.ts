import { OAuthProvider } from '@app/auth';
import { INodeEntity } from '@app/common';
import { IUserEntity } from './user.interface';

/**
 * OAuth Ticket Entity Interface
 */
export interface IOAuthTicketEntity extends INodeEntity {
  user: IUserEntity;
  provider: OAuthProvider;
  encryptedTicketData: Buffer;
}
