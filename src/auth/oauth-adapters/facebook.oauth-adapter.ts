import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { stringify } from 'qs';
import { httpClient } from '../../common';
import { OauthAdapter, AuthorizeOauthResponse } from '../interfaces';

/**
 * Facebook Oauth Adapter
 */
@Injectable()
export class FaceboookOauthAdapter implements OauthAdapter {
  /**
   * Default Scopes
   */
  private defaultScope = ['email'];

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
          client_id: this.config.get('oauth.facebook.clientId'),
          redirect_uri: this.config.get('oauth.facebook.redirectUri'),
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
              client_id: this.config.get('oauth.facebook.clientId'),
              client_secret: this.config.get('oauth.facebook.clientSecret'),
              redirect_uri: this.config.get('oauth.facebook.redirectUri'),
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
        profile: {
          name: `${info.first_name} ${info.last_name}`,
        },
        email: {
          address: info.email,
        },
      },
    ];
  }
}
