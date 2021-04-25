import { ISendMailOptions } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { renderFile } from 'pug';
import { MAILING_QUEUE } from '../../../constants';

/**
 * Mailing Service
 */
export class MailingService {
  /**
   * Logger
   */
  private logger: Logger;

  /**
   * Constructor
   *
   * @param {ClientProxy} client
   */
  constructor(@InjectQueue(MAILING_QUEUE) private mailingQueue: Queue) {
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

      await this.mailingQueue.add(options, {
        attempts: 3,
        removeOnFail: true,
        removeOnComplete: true,
      });
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
