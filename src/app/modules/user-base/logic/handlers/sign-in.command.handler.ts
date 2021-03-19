import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IAuthPayloadType } from '../../interfaces/auth-payload.type';
import { SignInCommand } from '../commands/sign-in.command';
import { UserService } from '../services/user.service';

/**
 * Sign In Command Handler
 */
@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler<SignInCommand> {
  /**
   * Constructor
   *
   * @param {UserService} userService
   */
  constructor(private userService: UserService) {}

  /**
   * Execute
   *
   * @param {SignInCommand} command
   * @returns
   */
  async execute(command: SignInCommand): Promise<IAuthPayloadType> {
    return this.userService.signIn(command.input);
  }
}
