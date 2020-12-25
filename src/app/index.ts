import 'reflect-metadata';
import {Container} from 'typedi';
import {createConnection, useContainer as ormUseContainer} from 'typeorm';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';

import createServer from './Http/Express/createServer';
import createSchema from './Schema/createSchema';
import entities from './Schema/entities';
import clear from '../utils/clear';
import env from '../utils/env';
import logger from '../utils/logger';

// Clean-Up Console
clear();

// Initiate App
(async () => {
  try {
    // Initialize ORM
    ormUseContainer(Container);
    const ormConnection = await createConnection({
      name: 'default',
      // Should be one of: mysql, postgres
      type: env('TYPEORM_CONNECTION') as 'mysql',
      host: env('TYPEORM_HOST'),
      port: parseInt(env('TYPEORM_PORT'), 10),
      database: env('TYPEORM_DATABASE'),
      username: env('TYPEORM_USERNAME'),
      password: env('TYPEORM_PASSWORD'),
      namingStrategy: new SnakeNamingStrategy(),
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
      entities,
    });

    // Initiate GraphQL Schema
    const schema = await createSchema({
      container: Container,
    });

    // Dispatch!
    const server = await createServer({schema});

    logger.info(`The server is responding on http://localhost:${env('APP_PORT')}`);

    // Gracefully shutdown the server on interrupts
    (['SIGINT', 'SIGTERM'] as NodeJS.Signals[]).forEach(SIGNAL => {
      process.on(SIGNAL, () => {
        ormConnection.close();
        server.close();
      });
    });
  } catch (error) {
    console.log(error);
    logger.error(error.message);
  }
})();
