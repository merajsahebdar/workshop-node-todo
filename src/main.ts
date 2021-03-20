import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { ApolloErrorFilter } from './filters/apollo-error.filter';

/**
 * Bootstrap
 */
(async () => {
  const app = await NestFactory.create(AppModule);

  // Config Service
  const configService = app.get(ConfigService);

  // Global Filters
  app.useGlobalFilters(new ApolloErrorFilter());

  // Run!
  await app.listen(configService.get('app.port', 3000));
})();
