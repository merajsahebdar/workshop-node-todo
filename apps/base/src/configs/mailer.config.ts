import { rootDir } from '@app/shared';
import { resolve } from 'path';

/**
 * Mailer Config
 */
export function mailerConfig() {
  return {
    mailer: {
      transport: process.env.MAILER_TRANSPORT,
      defaults: {
        from: process.env.MAILER_DEFAULT_SENDER,
      },
      templateDir: resolve(rootDir, 'src', 'app', 'templates'),
    },
  };
}
