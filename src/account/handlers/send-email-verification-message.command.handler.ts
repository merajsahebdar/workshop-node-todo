import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { stringify } from 'qs';
import { asset, SignedParamsService } from '../../common';
import { MailerService } from '../../common';
import { SendEmailVerificationMessageCommand } from '../commands';

/**
 * Send Email Verification Email Command Handler
 */
@CommandHandler(SendEmailVerificationMessageCommand)
export class SendEmailVerificationMessageCommandHandler
  implements ICommandHandler<SendEmailVerificationMessageCommand> {
  /**
   * Constructor
   *
   * @param config
   * @param signedParams
   * @param mailing
   */
  constructor(
    private config: ConfigService,
    private signedParams: SignedParamsService,
    private mailerService: MailerService,
  ) {}

  /**
   * Execute
   *
   * @param command
   * @returns
   */
  async execute({
    profile,
    email: { id, address },
  }: SendEmailVerificationMessageCommand): Promise<void> {
    const [expires, signature] = this.signedParams.sign({
      id,
      address,
    });

    const verificationUrl = new URL(
      stringify(
        {
          address,
          expires,
          signature,
        },
        { addQueryPrefix: true },
      ),
      this.config.get('account.emailVerificationUrl'),
    );

    await this.mailerService.sendMail({
      to: address,
      template: asset('templates', 'account', 'email-verification.pug'),
      context: {
        profile,
        verificationUrl: verificationUrl.toString(),
      },
    });
  }
}
