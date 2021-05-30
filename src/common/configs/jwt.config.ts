import { join } from 'path';
import { ROOT_DIR } from '../constants';

/**
 * JWT Config
 */
export function jwtConfig() {
  return {
    jwt: {
      publicKeyPath: join(ROOT_DIR, process.env.JWT_PUBLIC_KEY as string),
      privateKeyPath: join(ROOT_DIR, process.env.JWT_PRIVATE_KEY as string),
      privateKeyPassphrase: process.env.JWT_PRIVATE_KEY_PASSPHRASE as string,
    },
  };
}
