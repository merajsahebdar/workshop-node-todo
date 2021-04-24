import { OAuthService } from '@app/auth';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AuthorizeOAuthCommand } from '../commands';
import { UserEntity } from '../entities';
import { OAuthTicketCreatedEvent, UserSignedUpEvent } from '../events';
import { AccountService, UserService } from '../services';

/**
 * Authorize OAuth Command Handler
 */
@CommandHandler(AuthorizeOAuthCommand)
export class AuthorizeOAuthCommandHandler
  implements ICommandHandler<AuthorizeOAuthCommand> {
  /**
   * Constructor
   *
   * @param {EventBus} eventBus
   * @param {OAuthService} oauthService
   * @param {UserService} userService
   * @param {AccountService} accountService
   */
  constructor(
    private eventBus: EventBus,
    private oauthService: OAuthService,
    private userService: UserService,
    private accountService: AccountService,
  ) {}

  /**
   * Execute
   *
   * @param {AuthorizeOAuthCommand} command
   * @returns
   */
  async execute(command: AuthorizeOAuthCommand): Promise<[UserEntity, string]> {
    const [
      oauthUser,
      encryptedTicketData,
    ] = await this.oauthService.authorizeOAuth(
      command.input.provider,
      command.input.code,
    );

    const isRegistered = await this.userService.emailExists({
      address: oauthUser.email.address,
    });

    if (isRegistered) {
      const user = await this.userService.findUserByEmailAddress(
        oauthUser.email.address,
      );

      await this.userService.updateOAuthTicketByUser(user, {
        provider: command.input.provider,
        encryptedTicketData,
      });

      return [user, this.userService.signAccessToken(user)];
    } else {
      // Create User
      const user = await this.userService.createUser({
        isActivated: true,
        isBlocked: false,
      });

      const email = await this.userService.createEmail({
        user,
        address: oauthUser.email.address,
        isVerified: true,
        isPrimary: true,
      });

      const account = await this.accountService.createAccount({
        user,
        nickname: oauthUser.account.nickname,
      });

      const oauthTicket = await this.userService.updateOAuthTicketByUser(user, {
        provider: command.input.provider,
        encryptedTicketData,
      });

      this.eventBus.publish(new UserSignedUpEvent(user, email, account));
      this.eventBus.publish(new OAuthTicketCreatedEvent(oauthTicket, user));

      return [user, this.userService.signAccessToken(user)];
    }
  }
}
