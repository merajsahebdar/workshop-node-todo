import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationOptions,
} from 'class-validator';
import { DatabaseService } from '../services';

type IsUniqueConstraint = (
  value: unknown,
  db: DatabaseService,
) => Promise<boolean>;

interface IsUniqueValidationArguments extends ValidationArguments {
  constraints: [IsUniqueConstraint];
}

/**
 * Match With Decorator
 *
 * @param constraint
 * @param validationOptions
 * @returns
 */
export function IsUnique(
  constraint: IsUniqueConstraint,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [constraint],
      validator: IsUniqueValidatorConstraint,
    });
  };
}

/**
 * Is Unique Validator
 */
@ValidatorConstraint({ name: 'isUnique', async: true })
@Injectable()
export class IsUniqueValidatorConstraint
  implements ValidatorConstraintInterface {
  /**
   * Constructor
   *
   * @param db
   */
  constructor(private db: DatabaseService) {}

  /**
   * @inheritdoc
   */
  async validate(value: string, args: IsUniqueValidationArguments) {
    const [validator] = args.constraints;

    return validator(value, this.db);
  }

  /**
   * @inheritdoc
   */
  defaultMessage(args: ValidationArguments) {
    return `A resource with the same property: '${args.property}' already exist.`;
  }
}
