import { QueryFailedError } from 'typeorm';

/**
 * Check whether the given error instance caused by
 *  database unique constraint or not.
 *
 * NOTE:
 * This function designed to work with PostgreSQL driver.
 * The flow or error code may be different in other drivers.
 *
 * @param {QueryFailedError} error
 * @returns
 */
export function isUniqueConstraintError(error: QueryFailedError): boolean {
  if ((error as any).code === '23505') {
    return true;
  }

  return false;
}
