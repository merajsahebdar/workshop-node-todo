import { Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-core';

/**
 * Apollo Error Filter
 *
 * NOTO:
 * The only purpose for this filter is to avoid the builtin exception handler
 *  to log Apollo errors.
 */
@Catch(ApolloError)
export class ApolloErrorFilter implements GqlExceptionFilter {
  /**
   * Catch
   *
   * @param {ApolloError} error
   */
  catch(error: ApolloError) {
    throw error;
  }
}
