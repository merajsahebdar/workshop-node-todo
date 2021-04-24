import { OAuthProvider } from '@app/auth';

/**
 * Authorize OAuth Input Interface
 */
export interface IAuthorizeOAuthInput {
  provider: OAuthProvider;
  code: string;
}
