import { ISendMailOptions } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Queue } from 'bull';
import { MAILING_QUEUE, MESSAGE_PATTERN_SEND_MAIL } from '../constants';

/**
 * Mailing Queue Controller
 */
@Controller()
export class MailingController {
  /**
   * Constructor
   *
   * @param {Queue} mailerQueue
   */
  constructor(@InjectQueue(MAILING_QUEUE) private mailingQueue: Queue) {}

  /**
   * Send Mail
   */
  @MessagePattern(MESSAGE_PATTERN_SEND_MAIL)
  async sendMail(@Payload() options: ISendMailOptions): Promise<void> {
    try {
      await this.mailingQueue.add(options, {
        attempts: 3,
        removeOnFail: true,
        removeOnComplete: true,
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
