import { SignedParamsService } from '@app/common';
import { MailingService } from '@app/mailing-lib';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { join } from 'path';
import { stringify } from 'qs';
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
   * @param {Queue} mailerQueue
   * @param {ConfigService} configService
   * @param {SignedParamsService} signedParamsService
   */
  constructor(
    private configService: ConfigService,
    private signedParamsService: SignedParamsService,
    private mailingService: MailingService,
  ) {}

  /**
   * Execute
   *
   * @param {SendUserVerificationEmailCommand} command
   */
  async execute({
    account,
    email: { id, address },
  }: SendEmailVerificationMessageCommand): Promise<void> {
    const [expires, signature] = this.signedParamsService.sign({
      id,
      address,
    });

    const verificationURL = new URL(
      stringify(
        {
          address,
          expires,
          signature,
        },
        { addQueryPrefix: true },
      ),
      this.configService.get('app.setting.userVerificationURL'),
    );

    await this.mailingService.sendMail({
      to: address,
      template: join(__dirname, 'templates', 'verification.pug'),
      context: {
        account,
        verificationURL: verificationURL.toString(),
      },
    });
  }
}
