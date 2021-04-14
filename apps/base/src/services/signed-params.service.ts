import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { addMinutes } from 'date-fns';
import { HashService } from './hash.service';

// Params Interface
type IParams = Record<string | number, any>;

// Hash Algorithm
const HASH_ALGORITHM = 'sha256';

/**
 * Signed Params Service
 */
@Injectable()
export class SignedParamsService {
  /**
   * Constructor
   *
   * @param {ConfigService} configService
   * @param {HashService} hashService
   */
  constructor(
    private configService: ConfigService,
    private hashService: HashService,
  ) {}

  /**
   * Sign
   *
   * @param {IParams} params
   * @returns
   */
  sign(params: IParams): [number, string] {
    if (params.expires) {
      throw new Error(`The key: 'expires' is reserved in signed params.`);
    }

    const expires = addMinutes(
      new Date(),
      this.configService.get('app.signedRequestExpires', 7200),
    ).getTime();

    const signature = this.hashService.hmac(HASH_ALGORITHM, {
      ...params,
      expires,
    });

    return [expires, signature];
  }

  /**
   * Verify
   *
   * @param {number} expires
   * @param {string} signature
   * @param {IParams} params
   */
  verify(expires: number, signature: string, params: IParams): boolean {
    if (
      expires >= new Date().getTime() &&
      this.hashService.hmac(HASH_ALGORITHM, { ...params, expires }) ===
        signature
    ) {
      return true;
    }

    return false;
  }
}
