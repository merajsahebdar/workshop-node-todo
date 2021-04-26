import { join } from 'path';
import { ROOT_DIR } from '../constants';

/**
 * Resolve Asset Path
 *
 * @param {string[]} paths
 * @returns
 */
export function asset(...paths: string[]): string {
  return join(ROOT_DIR, 'dist', 'assets', ...paths);
}
