import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';
import { readFileSync } from 'fs';

/**
 * Jwt Service
 *
 * @memberof Feature/Auth/Service
 */
@Injectable()
export class JwtService {
  /**
   * Secret or Private Key to sign tokens.'
   * @type
   */
  private secretOrPrivateKey: string | { key: Buffer; passphrase: string };

  /**
   * Secret or Public Key to verify tokens.
   * @type
   */
  private secretOrPublicKey: string | Buffer;

  /**
   * Constructor
   *
   * @param {ConfigService} configService
   */
  constructor(configService: ConfigService) {
    this.secretOrPrivateKey = {
      key: readFileSync(configService.get('jwt.privateKeyPath') as string),
      passphrase: configService.get('jwt.privateKeyPassphrase') as string,
    };
    this.secretOrPublicKey = readFileSync(
      configService.get('jwt.publicKeyPath') as string,
    );
  }

  /**
   * Sign a new token.
   *
   * @param {any} payload
   * @returns {string}
   */
  signToken(payload: any): string {
    return sign(payload, this.secretOrPrivateKey, { algorithm: 'RS256' });
  }

  /**
   * Verify the provided token.
   *
   * @param {string} token
   * @returns {any}
   */
  verifyToken(token: string): any {
    return verify(token, this.secretOrPublicKey, {
      algorithms: ['RS256'],
    });
  }
}
