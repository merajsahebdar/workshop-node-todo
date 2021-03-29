import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity } from '../../database/entities/user.entity';
import { SignUpCommand } from '../commands/sign-up.command';
import { UserSignedUpEvent } from '../events/user-signed-up.event';
import { UserService } from '../services/user.service';

/**
 * Sign Up Command Handler
 */
@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
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
   * @param {SignUpCommand} command
   * @returns
   */
  async execute(command: SignUpCommand): Promise<[UserEntity, string]> {
    const [user, accessToken] = await this.userService.signUp(command.input);

    this.eventBus.publish(new UserSignedUpEvent(user));

    return [user, accessToken];
  }
}
