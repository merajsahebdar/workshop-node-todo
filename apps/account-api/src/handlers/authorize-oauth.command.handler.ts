import { OAuthService } from '@app/auth';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AuthorizeOAuthCommand } from '../commands';
import { UserEntity } from '../entities';
import { OAuthTicketCreatedEvent, UserSignedUpEvent } from '../events';
import {
  AuthService,
  EmailService,
  OAuthTicketService,
  UserService,
} from '../services';

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
   * @param {AuthService} authService
   * @param {UserService} userService
   * @param {EmailService} emailService
   * @param {OAuthTicketService} oauthTicketService
   */
  constructor(
    private eventBus: EventBus,
    private oauthService: OAuthService,
    private authService: AuthService,
    private userService: UserService,
    private emailService: EmailService,
    private oauthTicketService: OAuthTicketService,
  ) {}

  /**
   * Execute
   *
   * @param {AuthorizeOAuthCommand} command
   * @returns
   */
  async execute({
    input,
  }: AuthorizeOAuthCommand): Promise<[UserEntity, string]> {
    const [
      { email: oauthEmail, account: oauthAccount },
      encryptedTicketData,
    ] = await this.oauthService.authorizeOAuth(input.provider, input.code);

    const isRegistered = await this.emailService.isRegistered(
      oauthEmail.address,
    );

    if (isRegistered) {
      const user = await this.userService.findByEmailAddress(
        oauthEmail.address,
      );

      await this.oauthTicketService.updateOAuthTicketByUser(user, {
        provider: input.provider,
        encryptedTicketData,
      });

      return [user, this.authService.signAccessToken(user)];
    } else {
      // Create User
      const { user, email, account } = await this.authService.signUp(
        {},
        {
          address: oauthEmail.address,
          isVerified: true,
        },
        {
          nickname: oauthAccount.nickname,
        },
      );

      const oauthTicket = await this.oauthTicketService.updateOAuthTicketByUser(
        user,
        {
          provider: input.provider,
          encryptedTicketData,
        },
      );

      this.eventBus.publish(new UserSignedUpEvent(user, email, account));
      this.eventBus.publish(new OAuthTicketCreatedEvent(oauthTicket, user));

      return [user, this.authService.signAccessToken(user)];
    }
  }
}
