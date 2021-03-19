import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignUpCommand } from '../commands/sign-up.command';
import { UserService } from '../services/user.service';

/**
 * Sign Up Command Handler
 */
@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
  /**
   * Constructor
   *
   * @param {UserService} userService
   */
  constructor(private userService: UserService) {}

  /**
   * Execute
   *
   * @param {SignUpCommand} command
   * @returns
   */
  async execute(command: SignUpCommand): Promise<string> {
    return this.userService.signUp(command.input);
  }
}
