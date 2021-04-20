import { RemoteGraphQLDataSource } from '@apollo/gateway';

/**
 * Authenticated Data Source
 */
export class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  async willSendRequest({ request, context }) {
    if (context.req) {
      request.http.headers.set(
        'authorization',
        context.req.headers.authorization,
      );
    }
  }
}
