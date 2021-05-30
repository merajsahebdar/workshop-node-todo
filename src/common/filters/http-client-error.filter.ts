import { Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { HttpClientError } from '../utils';

/**
 * Apollo Error Filter
 *
 * NOTO:
 * The only purpose for this filter is to avoid the builtin exception handler
 *  to log Http Client errors.
 */
@Catch(HttpClientError)
export class HttpClientErrorFilter implements GqlExceptionFilter {
  /**
   * Catch
   *
   * @param {HttpClientError} error
   */
  catch(error: HttpClientError) {
    throw error;
  }
}
