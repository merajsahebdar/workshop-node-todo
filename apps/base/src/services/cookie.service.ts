import { IAppContext } from '@app/shared';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';

@Injectable({ scope: Scope.REQUEST })
export class CookieService {
  /**
   * Constructor
   *
   * NOTO: We do not have access to context on non-graphql requests.
   * Instead we need to inject `REQUEST`.
   * SEE: https://docs.nestjs.com/fundamentals/injection-scopes
   *
   * @param {IAppContext} context
   */
  constructor(@Inject(CONTEXT) private context: IAppContext) {}

  /**
   * Set a cookie.
   *
   * @param {string} key
   * @param {string} value
   */
  setCookie(key: string, value: string) {
    const { res } = this.context;

    res.cookie(key, value, { httpOnly: true });
  }
}
