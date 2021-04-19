import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MAILING_QUEUE } from './constants';
import { MailingController } from './controllers';
import { MailingQueueProcessor } from './queue-processors';

/**
 * Mailing Lib Module
 */
@Module({
  imports: [
    // Third-party Modules
    // Queue
    BullModule.registerQueue({ name: MAILING_QUEUE }),
  ],
  controllers: [MailingController],
  providers: [MailingQueueProcessor],
})
export class MailingLibModule {}
