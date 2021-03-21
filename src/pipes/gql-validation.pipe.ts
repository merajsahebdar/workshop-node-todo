import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { UserInputError } from 'apollo-server-core';

/**
 * GraphQL Validation Pipe
 */
export class GqlValidationPipe extends ValidationPipe {
  /**
   * Constructor
   *
   * @param {ValidationPipeOptions} options
   */
  constructor(options?: ValidationPipeOptions) {
    super({
      ...options,
      exceptionFactory: (errors) => {
        return new UserInputError('The provided inputs are not valid.', {
          invalidArgs: errors,
        });
      },
    });
  }
}
