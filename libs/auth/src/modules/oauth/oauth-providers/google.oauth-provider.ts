import { httpClient } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { stringify } from 'qs';
import { IOAuthProvider, AuthorizeOAuthResponse } from '../interfaces';

/**
 * Google OAuth Provider
 */
@Injectable()
export class GoogleOAuthProvider implements IOAuthProvider {
  /**
   * Default Scopes
   */
  private defaultScope = [
    'openid',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

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
          client_id: this.configService.get('oauth.google.clientId'),
          redirect_uri: this.configService.get('oauth.google.redirectUri'),
          scope: [...this.defaultScope, ...scope].join(' '),
          response_type: 'code',
          access_type: 'offline',
          prompt: 'consent',
        },
        {
          addQueryPrefix: true,
        },
      ),
      'https://accounts.google.com/o/oauth2/v2/auth',
    ).toString();
  }

  /**
   * Authorize OAuth
   *
   * @param {string} code
   * @returns
   */
  async authorizeOAuth(code: string): Promise<AuthorizeOAuthResponse> {
    const ticket = await httpClient('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.configService.get('oauth.google.clientId'),
        client_secret: this.configService.get('oauth.google.clientSecret'),
        redirect_uri: this.configService.get('oauth.google.redirectUri'),
        grant_type: 'authorization_code',
        code,
      }),
    });

    const info = await httpClient(
      new URL(
        stringify({}, { addQueryPrefix: true }),
        'https://www.googleapis.com/oauth2/v2/userinfo',
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
        account: { nickname: `${info.given_name} ${info.family_name}` },
        email: {
          address: info.email,
        },
      },
    ];
  }
}
