import { GraphNodeInterface } from '@app/common';
import { GraphEmailInterface } from './email.interface';
import { GraphProfileInterface } from './profile.interface';

/**
 * Graph User Interface
 */
export interface GraphUserInterface extends GraphNodeInterface {
  profile: GraphProfileInterface;
  emails: GraphEmailInterface[];
  isActivated: boolean;
  isBlocked: boolean;
}
