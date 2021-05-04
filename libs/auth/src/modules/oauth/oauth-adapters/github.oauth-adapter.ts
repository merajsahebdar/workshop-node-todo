import { httpClient } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { stringify } from 'qs';
import { OauthAdapter, AuthorizeOauthResponse } from '../interfaces';

/**
 * GitHub Oauth Adapter
 */
@Injectable()
export class GitHubOauthAdapter implements OauthAdapter {
  /**
   * Default Scopes
   */
  private defaultScope = ['read:user', 'user:email'];

  /**
   * Constructor
   *
   * @param config
   */
  constructor(private config: ConfigService) {}

  /**
   * Request Oauth
   *
   * @param scope
   * @returns
   */
  requestOauth(scope: string[] = []): string {
    return new URL(
      stringify(
        {
          client_id: this.config.get('oauth.github.clientId'),
          redirect_uri: this.config.get('oauth.github.redirectUri'),
          scope: [...this.defaultScope, ...scope].join(' '),
          allow_signup: true,
        },
        {
          addQueryPrefix: true,
        },
      ),
      'https://github.com/login/oauth/authorize',
    ).toString();
  }

  /**
   * Authorize Oauth
   *
   * @param code
   * @returns
   */
  async authorizeOauth(code: string): Promise<AuthorizeOauthResponse> {
    const ticket = await (
      await fetch(
        new URL(
          stringify(
            {
              client_id: this.config.get('oauth.google.clientId'),
              client_secret: this.config.get('oauth.google.clientSecret'),
              redirect_uri: this.config.get('oauth.google.redirectUri'),
              code,
            },
            { addQueryPrefix: true },
          ),
          'https://github.com/login/oauth/access_token',
        ).toString(),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    ).json();

    const info = await httpClient(
      new URL(
        stringify({}, { addQueryPrefix: true }),
        'https://api.github.com/user',
      ).toString(),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ticket.access_token}`,
        },
      },
    );

    return [
      ticket,
      {
        profile: {
          name: info.name,
        },
        email: {
          address: info.email,
        },
      },
    ];
  }
}
