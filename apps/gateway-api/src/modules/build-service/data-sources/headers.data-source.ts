import { RemoteGraphQLDataSource } from '@apollo/gateway';

/**
 * Headers Data Source
 */
export class HeadersDataSource extends RemoteGraphQLDataSource {
  /**
   * Patches before sending the request to the host service.
   *
   * @param requestContext
   *
   */
  willSendRequest({ request, context }) {
    if (context.req) {
      if (context.req.headers) {
        for (const [key, value] of Object.entries(context.req.headers)) {
          request.http.headers.set(key, value);
        }
      }
    }
  }

  /**
   * Patches after receiving the response from the host service.
   *
   * @param requestContext
   * @returns
   */
  didReceiveResponse({ response, context }) {
    const cookieString = response.http.headers.get('set-cookie');
    if (context.req && context.res && cookieString) {
      context.res.append('Set-Cookie', cookieString.split(/,\s?/));
    }

    return response;
  }
}
