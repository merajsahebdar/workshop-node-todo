import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MAILER_QUEUE } from './constants';
import {
  CookieService,
  DatabaseService,
  HashService,
  JwtService,
  SignedParamsService,
} from './services';
import { IsUniqueValidatorConstraint } from './validators';

// Services
const services: Provider[] = [
  DatabaseService,
  JwtService,
  HashService,
  CookieService,
  SignedParamsService,
  IsUniqueValidatorConstraint,
];

/**
 * Common Module
 */
@Module({
  imports: [
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
    BullModule.registerQueue({ name: MAILER_QUEUE }),
    // Mailer
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: configService.get('mailer.transport'),
        defaults: {
          from: configService.get('mailer.defaults.from'),
        },
      }),
    }),
  ],
  providers: [
    // Services
    ...services,
  ],
  exports: [
    // Services
    ...services,
  ],
})
export class CommonModule {
  /**
   * Register Module Globally
   *
   * @returns
   */
  static forRoot(): DynamicModule {
    return {
      module: CommonModule,
      global: true,
    };
  }
}
