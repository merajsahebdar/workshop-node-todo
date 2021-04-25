import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { UserInputError } from 'apollo-server-core';
import { ValidationError } from 'class-validator';

/**
 * Map Errors
 *
 * @param {ValidationError[]} errors
 * @returns
 */
function mapErrors(errors: ValidationError[]) {
  return errors.map((error) => ({
    property: error.property,
    constraints: error.constraints,
    ...(error.children && error.children.length !== 0
      ? { children: mapErrors(error.children) }
      : {}),
  }));
}

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
          invalidArgs: mapErrors(errors),
        });
      },
    });
  }
}
