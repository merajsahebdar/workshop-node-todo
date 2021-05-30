import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { stringify } from 'qs';
import { httpClient } from '../../common';
import { OauthAdapter, AuthorizeOauthResponse } from '../interfaces';

/**
 * Google Oauth Adapter
 */
@Injectable()
export class GoogleOauthAdapter implements OauthAdapter {
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
          client_id: this.config.get('oauth.google.clientId'),
          redirect_uri: this.config.get('oauth.google.redirectUri'),
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
   * Authorize Oauth
   *
   * @param code
   * @returns
   */
  async authorizeOauth(code: string): Promise<AuthorizeOauthResponse> {
    const ticket = await httpClient('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.config.get('oauth.google.clientId'),
        client_secret: this.config.get('oauth.google.clientSecret'),
        redirect_uri: this.config.get('oauth.google.redirectUri'),
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
        profile: { name: `${info.given_name} ${info.family_name}` },
        email: {
          address: info.email,
        },
      },
    ];
  }
}
