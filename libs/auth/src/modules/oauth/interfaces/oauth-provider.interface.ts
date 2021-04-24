import { IOAuthUser } from './oauth-user.interface';

// Authorize OAuth Response
export type AuthorizeOAuthResponse = [Record<string, unknown>, IOAuthUser];

/**
 * OAuth Provider Interface
 */
export interface IOAuthProvider {
  /**
   * Request OAuth
   *
   * @param {string[]} scope
   * @returns
   */
  requestOAuth(scope: string[]): Promise<string> | string;

  /**
   * Authorize OAuth
   *
   * @param {string} code
   * @returns
   */
  authorizeOAuth(
    code: string,
  ): Promise<AuthorizeOAuthResponse> | AuthorizeOAuthResponse;
}
