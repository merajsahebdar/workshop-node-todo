import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity } from '../../database/entities/user.entity';
import { SignInCommand } from '../commands/sign-in.command';
import { UserSignedInEvent } from '../events/user-signed-in.event';
import { UserService } from '../services/user.service';

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
