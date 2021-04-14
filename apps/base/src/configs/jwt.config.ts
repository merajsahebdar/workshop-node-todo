import { rootDir } from '@app/shared';
import { join } from 'path';

/**
 * JWT Config
 */
export function jwtConfig() {
  return {
    jwt: {
      publicKeyPath: join(rootDir, process.env.JWT_PUBLIC_KEY as string),
      privateKeyPath: join(rootDir, process.env.JWT_PRIVATE_KEY as string),
      privateKeyPassphrase: process.env.JWT_PRIVATE_KEY_PASSPHRASE as string,
    },
  };
}
