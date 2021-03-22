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
        return new UserInputError('Provided inputs are not valid.', {
          invalidArgs: errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          })),
        });
      },
    });
  }
}
