import { JwtService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { RefreshToken, User } from '@prisma/client';

/**
 * Auth Service
 */
@Injectable()
export class AuthService {
  /**
   * Constructor
   *
   * @param jwt
   */
  constructor(private jwt: JwtService) {}

  /**
   * Sign a new access token for provided user.
   *
   * @param user
   * @returns
   */
  signAccessToken(user: User): string {
    return this.jwt.signToken({ uid: user.id });
  }

  /**
   * Sign a new refresh token.
   *
   * @param refreshToken
   * @returns
   */
  signRefreshToken(refreshToken: RefreshToken): string {
    return this.jwt.signToken({
      uid: refreshToken.userId,
      dip: refreshToken.clientIp,
      did: refreshToken.userAgent,
      ver: refreshToken.id,
    });
  }
}
