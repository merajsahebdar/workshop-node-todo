import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { MAILING_QUEUE } from './mailing-queue.constant';

export const MAILING_QUEUE_MODULES = [
  // Third-party Modules
  // Queue
  BullModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      redis: {
        host: configService.get('queue.host'),
        port: configService.get('queue.port'),
      },
    }),
  }),
  BullModule.registerQueue({ name: MAILING_QUEUE }),
];
