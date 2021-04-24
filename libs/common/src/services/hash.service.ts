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

  /**
   * Encrypt
   *
   * @param {T} data
   * @returns
   */
  encrypt<T extends IData = IData>(data: T): Buffer {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
      'aes-256-gcm',
      Buffer.from(
        (this.configService.get('common.appKey') as string).substr(0, 32),
        'utf-8',
      ),
      iv,
    );

    return Buffer.concat([
      iv,
      cipher.update(this.normalizeData(data)),
      cipher.final(),
      cipher.getAuthTag(),
    ]);
  }

  /**
   * Decrypt
   *
   * @param {Buffer} encryptedData
   * @returns
   */
  decrypt<T extends IData = IData>(encryptedData: Buffer): T {
    const iv = encryptedData.slice(0, 16);
    const tag = encryptedData.slice(-16);
    const data = encryptedData.slice(16, -16);

    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      Buffer.from(
        (this.configService.get('common.appKey') as string).substr(0, 32),
        'utf-8',
      ),
      iv,
    );

    decipher.setAuthTag(tag);

    return JSON.parse(
      Buffer.concat([decipher.update(data), decipher.final()]).toString(),
    );
  }
}
