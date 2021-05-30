import { OauthAdapterName } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { HashService } from '../../common';
import { OauthAdapter, OauthUser } from '../interfaces';
import {
  FaceboookOauthAdapter,
  GitHubOauthAdapter,
  GoogleOauthAdapter,
} from '../oauth-adapters';

/**
 * Oauth Service
 */
@Injectable()
export class OauthService {
  /**
   * Constructor
   *
   * @param hash
   * @param facebookAdapter
   * @param githubAdapter
   * @param googleAdapter
   */
  constructor(
    private hash: HashService,
    private facebookAdapter: FaceboookOauthAdapter,
    private githubAdapter: GitHubOauthAdapter,
    private googleAdapter: GoogleOauthAdapter,
  ) {}

  /**
   * Get Adapter Instance
   *
   * @param adapterName
   * @returns
   */
  private getAdapterInstance(adapterName: OauthAdapterName): OauthAdapter {
    switch (adapterName) {
      case OauthAdapterName.FACEBOOK:
        return this.facebookAdapter;
      case OauthAdapterName.GITHUB:
        return this.githubAdapter;
      case OauthAdapterName.GOOGLE:
        return this.googleAdapter;
    }
  }

  /**
   * Request Oauth
   *
   * @param adapterName
   * @param scope
   * @returns
   */
  async requestOauth(
    adapterName: OauthAdapterName,
    scope: string[] = [],
  ): Promise<string> {
    return await this.getAdapterInstance(adapterName).requestOauth(scope);
  }

  /**
   * Authorize Oauth
   *
   * @param adapterName
   * @param code
   * @returns
   */
  async authorizeOauth(
    adapterName: OauthAdapterName,
    code: string,
  ): Promise<[OauthUser, Buffer]> {
    const [ticket, user] = await this.getAdapterInstance(
      adapterName,
    ).authorizeOauth(code);

    return [user, this.hash.encrypt(ticket)];
  }
}
