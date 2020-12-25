import {ApolloServer} from 'apollo-server-fastify';
import fastify from 'fastify';
import cors from 'fastify-cors';

import env from '../../../utils/env';
import type {ServerConfig, Server} from '../types';

/**
 * Create Express Server
 *
 * @param {ServerConfig} config
 * @returns {Server}
 * @memberof App/Http/Express
 */
async function createServer({schema}: ServerConfig): Promise<Server> {
  // Initiate Fastify
  const app = fastify();
  app.register(cors);

  // Initiate Apollo Server
  app.register(
    new ApolloServer({
      schema,
      playground: env('NODE_ENV', 'development') === 'development',
    }).createHandler()
  );

  await app.listen(env('APP_PORT'));

  return {
    close: () => {
      app.close();
    },
  };
}

// DEFAULT EXPORT
export default createServer;
