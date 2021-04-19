import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto, { BinaryLike } from 'crypto';

// Data Interface
type IData = BinaryLike | Record<string | number, any> | any[];

/**
 * Hash Service
 */
@Injectable()
export class HashService {
  /**
   * Constructor
   *
   * @param {ConfigService} configService
   */
  constructor(private configService: ConfigService) {}

  /**
   * Normalize data before hash.
   *
   * @param {IData} data
   * @returns
   */
  private normalizeData(
    data: BinaryLike | Record<string | number, any>,
  ): BinaryLike {
    return typeof data === 'object'
      ? JSON.stringify(
          Object.keys(data)
            .sort()
            .reduce((acc, key) => {
              acc[key] = data[key];
              return acc;
            }, {}),
        )
      : data;
  }

  /**
   * Hmac
   *
   * @param {string} algorithm
   * @param {IData} data
   * @returns
   */
  hmac(algorithm: string, data: IData): string {
    return crypto
      .createHmac(algorithm, this.configService.get('common.appKey') as string)
      .update(this.normalizeData(data))
      .digest('hex');
  }
}
