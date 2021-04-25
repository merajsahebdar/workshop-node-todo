import { redisConfig } from '@app/common';
import { MailingLibModule } from '@app/mailing-lib';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { mailerConfig } from './configs';

/**
 * Mailing Service Module
 */
@Module({
  imports: [
    // Third-party Modules
    // Configuration
    ConfigModule.forRoot({
      load: [mailerConfig, redisConfig],
      isGlobal: true,
    }),
    // App Modules
    MailingLibModule,
  ],
})
export class MailingSvcModule {}
