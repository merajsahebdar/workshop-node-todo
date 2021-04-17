import { Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-core';
import { AppInputError } from '../errors';

/**
 * App Input Error Filter
 */
@Catch(AppInputError)
export class GqlAppInputErrorFilter implements GqlExceptionFilter {
  /**
   * Catch
   *
   * @param {ApolloError} error
   */
  catch(error: AppInputError) {
    throw new UserInputError(error.message);
  }
}
