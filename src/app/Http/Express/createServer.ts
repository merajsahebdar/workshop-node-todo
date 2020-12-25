import {ApolloServer} from 'apollo-server-express';
import * as express from 'express';
import * as cors from 'cors';

import env from '../../../utils/env';
import type {ServerConfig, Server} from '../types';

/**
 * Create Express Server
 *
 * @param {ServerConfig} config
 * @returns {Server}
 * @memberof App/Http/Express
 */
function createServer({schema}: ServerConfig): Promise<Server> {
  return new Promise(resolve => {
    // Initiate Express App
    const app = express();
    app.use(cors());

    // Initiate Apollo Server
    new ApolloServer({
      schema,
      playground: env('NODE_ENV', 'development') === 'development',
    }).applyMiddleware({
      app,
    });

    const http = app.listen(env('APP_PORT'), () => {
      resolve({
        close: () => {
          http.close();
        },
      });
    });
  });
}

// DEFAULT EXPORT
export default createServer;
