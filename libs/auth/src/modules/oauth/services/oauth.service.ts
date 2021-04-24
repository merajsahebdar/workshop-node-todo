import { HashService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { OAuthProvider } from '../enums';
import { IOAuthProvider, IOAuthUser } from '../interfaces';
import {
  FaceboookOAuthProvider,
  GitHubOAuthProvider,
  GoogleOAuthProvider,
} from '../oauth-providers';

/**
 * OAuth Service
 */
@Injectable()
export class OAuthService {
  /**
   * Constructor
   *
   * @param {FaceboookOAuthProvider} facebook
   */
  constructor(
    private hashService: HashService,
    private facebook: FaceboookOAuthProvider,
    private github: GitHubOAuthProvider,
    private google: GoogleOAuthProvider,
  ) {}

  /**
   * Get Provider Object
   *
   * @param {OAuthProvider} provider
   * @returns
   */
  private getProviderObject(provider: OAuthProvider): IOAuthProvider {
    switch (provider) {
      case OAuthProvider.FACEBOOK:
        return this.facebook;
      case OAuthProvider.GITHUB:
        return this.github;
      case OAuthProvider.GOOGLE:
        return this.google;
    }
  }

  /**
   * Request OAuth
   *
   * @param {OAuthProvider} provider
   * @param {string[]} scope
   * @returns
   */
  async requestOAuth(
    provider: OAuthProvider,
    scope: string[] = [],
  ): Promise<string> {
    return await this.getProviderObject(provider).requestOAuth(scope);
  }

  /**
   * Authorize OAuth
   *
   * @param {OAuthProvider} provider
   * @param {string} code
   * @returns
   */
  async authorizeOAuth(
    provider: OAuthProvider,
    code: string,
  ): Promise<[IOAuthUser, Buffer]> {
    const [ticket, user] = await this.getProviderObject(
      provider,
    ).authorizeOAuth(code);

    return [user, this.hashService.encrypt(ticket)];
  }
}
