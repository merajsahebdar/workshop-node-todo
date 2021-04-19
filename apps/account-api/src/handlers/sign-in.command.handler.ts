import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity } from '../entities';
import { SignInCommand } from '../commands';
import { UserSignedInEvent } from '../events';
import { UserService } from '../services';

/**
 * Sign In Command Handler
 */
@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler<SignInCommand> {
  /**
   * Constructor
   *
   * @param {EventBus} eventBus
   * @param {UserService} userService
   */
  constructor(private eventBus: EventBus, private userService: UserService) {}

  /**
   * Execute
   *
   * @param {SignInCommand} command
   * @returns
   */
  async execute(command: SignInCommand): Promise<[UserEntity, string]> {
    const [user, accessToken] = await this.userService.signIn(command.input);

    this.eventBus.publish(new UserSignedInEvent(user));

    return [user, accessToken];
  }
}
