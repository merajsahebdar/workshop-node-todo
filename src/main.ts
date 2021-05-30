import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import requestIp from 'request-ip';
import { AppModule } from './app.module';
import { ApolloErrorFilter, HttpClientErrorFilter } from './common';

/**
 * Bootstrap
 */
(async () => {
  const app = await NestFactory.create(AppModule);

  // Config Service
  const configService = app.get(ConfigService);

  // Global Filters
  app.useGlobalFilters(new ApolloErrorFilter(), new HttpClientErrorFilter());

  // Request Extending Tools
  app.use(cookieParser());
  app.use(requestIp.mw());

  // NOTE:
  // We need to register the container for `class-validator` to be able to
  //  use services and providers in class validation.
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Run!
  await app.listen(configService.get('common.port', 3000));
})();
