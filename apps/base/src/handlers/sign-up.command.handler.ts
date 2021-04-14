import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity } from '../entities';
import { SignUpCommand } from '../commands';
import { AccountCreatedEvent, UserSignedUpEvent } from '../events';
import { AccountService, UserService } from '../services';

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
   * @param {AccountService} accountService
   */
  constructor(
    private eventBus: EventBus,
    private userService: UserService,
    private accountService: AccountService,
  ) {}

  /**
   * Execute
   *
   * @param {SignUpCommand} command
   * @returns
   */
  async execute(command: SignUpCommand): Promise<[UserEntity, string]> {
    const [user, accessToken] = await this.userService.signUp(command.input);

    const account = await this.accountService.createAccount({
      userId: user.id,
      ...command.input.account,
    });

    this.eventBus.publish(new UserSignedUpEvent(user));
    this.eventBus.publish(new AccountCreatedEvent(account, user));

    return [user, accessToken];
  }
}
