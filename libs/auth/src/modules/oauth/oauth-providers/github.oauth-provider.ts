import { httpClient } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { stringify } from 'qs';
import { IOAuthProvider, AuthorizeOAuthResponse } from '../interfaces';

/**
 * GitHub OAuth Provider
 */
@Injectable()
export class GitHubOAuthProvider implements IOAuthProvider {
  /**
   * Default Scopes
   */
  private defaultScope = ['read:user', 'user:email'];

  /**
   * Constructor
   *
   * @param {ConfigService} configService
   */
  constructor(private configService: ConfigService) {}

  /**
   * Request OAuth
   *
   * @param {string[]} scope
   * @returns
   */
  requestOAuth(scope: string[] = []): string {
    return new URL(
      stringify(
        {
          client_id: this.configService.get('oauth.github.clientId'),
          redirect_uri: this.configService.get('oauth.github.redirectUri'),
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
   * Authorize OAuth
   *
   * @param {string} code
   * @returns
   */
  async authorizeOAuth(code: string): Promise<AuthorizeOAuthResponse> {
    const ticket = await (
      await fetch(
        new URL(
          stringify(
            {
              client_id: this.configService.get('oauth.google.clientId'),
              client_secret: this.configService.get(
                'oauth.google.clientSecret',
              ),
              redirect_uri: this.configService.get('oauth.google.redirectUri'),
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
        account: {
          nickname: info.name,
        },
        email: {
          address: info.email,
        },
      },
    ];
  }
}
