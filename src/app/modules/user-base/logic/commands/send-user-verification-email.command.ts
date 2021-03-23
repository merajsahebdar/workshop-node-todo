import { ICommand } from '@nestjs/cqrs';
import { IUserType } from '../../typing/interfaces/user.type';

/**
 * Send User Verification Email Command
 */
export class SendUserVerificationEmailCommand implements ICommand {
  /**
   * Constructor
   *
   * @param {IUserType} user
   */
  constructor(public readonly user: IUserType) {}
}
