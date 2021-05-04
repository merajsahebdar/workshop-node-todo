import { OauthUser } from './oauth-user.interface';

// Authorize Oauth Response
export type AuthorizeOauthResponse = [Record<string, unknown>, OauthUser];

/**
 * Oauth Adapter
 */
export interface OauthAdapter {
  /**
   * Request Oauth
   *
   * @param scope
   * @returns
   */
  requestOauth(scope: string[]): Promise<string> | string;

  /**
   * Authorize Oauth
   *
   * @param code
   * @returns
   */
  authorizeOauth(
    code: string,
  ): Promise<AuthorizeOauthResponse> | AuthorizeOauthResponse;
}
