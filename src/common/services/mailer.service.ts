import { ISendMailOptions } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { renderFile } from 'pug';
import { MAILER_QUEUE } from '../constants';

/**
 * Mailer Service
 */
export class MailerService {
  /**
   * Logger
   */
  private logger: Logger;

  /**
   * Constructor
   *
   * @param {ClientProxy} client
   */
  constructor(@InjectQueue(MAILER_QUEUE) private mailerQueue: Queue) {
    this.logger = new Logger(MailerService.name);
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

      await this.mailerQueue.add(options, {
        attempts: 3,
        removeOnFail: true,
        removeOnComplete: true,
      });
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
