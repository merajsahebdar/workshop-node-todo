import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity } from '../entities';
import { SignUpCommand } from '../commands';
import { AccountCreatedEvent, UserSignedUpEvent } from '../events';
import { AuthService } from '../services';

/**
 * Sign Up Command Handler
 */
@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
  /**
   * Constructor
   *
   * @param {EventBus} eventBus
   * @param {AuthService} authService
   */
  constructor(private eventBus: EventBus, private authService: AuthService) {}

  /**
   * Execute
   *
   * @param {SignUpCommand} command
   * @returns
   */
  async execute({ input }: SignUpCommand): Promise<[UserEntity, string]> {
    const { user, email, account } = await this.authService.signUp(
      {
        password: input.password,
      },
      input.email,
      input.account,
    );

    const accessToken = this.authService.signAccessToken(user);

    this.eventBus.publish(new UserSignedUpEvent(user, email, account));
    this.eventBus.publish(new AccountCreatedEvent(user, email, account));

    return [user, accessToken];
  }
}
