import { httpClient } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { stringify } from 'qs';
import { IOAuthProvider, AuthorizeOAuthResponse } from '../interfaces';

/**
 * Facebook OAuth Provider
 */
@Injectable()
export class FaceboookOAuthProvider implements IOAuthProvider {
  /**
   * Default Scopes
   */
  private defaultScope = ['email'];

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
          client_id: this.configService.get('oauth.facebook.clientId'),
          redirect_uri: this.configService.get('oauth.facebook.redirectUri'),
          scope: [...this.defaultScope, ...scope].join(','),
          response_type: 'code',
          auth_type: 'rerequest',
          display: 'popup',
        },
        {
          addQueryPrefix: true,
        },
      ),
      'https://www.facebook.com/v4.0/dialog/oauth',
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
              client_id: this.configService.get('oauth.facebook.clientId'),
              client_secret: this.configService.get(
                'oauth.facebook.clientSecret',
              ),
              redirect_uri: this.configService.get(
                'oauth.facebook.redirectUri',
              ),
              code,
            },
            { addQueryPrefix: true },
          ),
          'https://graph.facebook.com/v4.0/oauth/access_token',
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
        stringify(
          {
            fields: ['id', 'email', 'first_name', 'last_name'].join(','),
            access_token: ticket.access_token,
          },
          { addQueryPrefix: true },
        ),
        'https://graph.facebook.com/me',
      ).toString(),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return [
      ticket,
      {
        account: {
          nickname: `${info.first_name} ${info.last_name}`,
        },
        email: {
          address: info.email,
        },
      },
    ];
  }
}
