import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';

/**
 * Bootstrap
 */
(async () => {
  const app = await NestFactory.create(AppModule);

  // Config Service
  const configService = app.get(ConfigService);

  // Run!
  await app.listen(configService.get('app.port', 3000));
})();
