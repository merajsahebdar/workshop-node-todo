import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Inject, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { renderFile } from 'pug';
import { timeout } from 'rxjs/operators';
import { MESSAGE_PATTERN_SEND_MAIL } from '../../../constants';
import { MAILING_CLIENT } from '../constants';

/**
 * Mailing Service
 */
export class MailingService implements OnApplicationBootstrap {
  /**
   * Logger
   */
  private logger: Logger;

  /**
   * Constructor
   *
   * @param {ClientProxy} client
   */
  constructor(
    @Inject(MAILING_CLIENT) private client: ClientProxy,
    private configService: ConfigService,
  ) {
    this.logger = new Logger(MailingService.name);
  }

  /**
   * Send Mail
   *
   * @param {ISendMailOptions} options
   * @rreturns
   */
  async sendMail({
    template,
    context,
    ...options
  }: ISendMailOptions): Promise<void> {
    try {
      if (template) {
        options.html = renderFile(template, context ?? {});
      }

      await this.client
        .send(MESSAGE_PATTERN_SEND_MAIL, options)
        .pipe(timeout(this.configService.get('mailer.timeout', 5000)))
        .toPromise();
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async onApplicationBootstrap() {
    await this.client.connect();
  }
}
