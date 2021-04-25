import { NestFactory } from '@nestjs/core';
import { MailingSvcModule } from './mailing-svc.module';

/**
 * Bootstrap
 */
(async () => {
  const app = await NestFactory.createMicroservice(MailingSvcModule);

  // Run!
  await app.listenAsync();
})();
