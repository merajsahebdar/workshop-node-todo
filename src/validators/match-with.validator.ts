import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Match With Decorator
 *
 * @param {string} property
 * @param {ValidationOptions} validationOptions
 * @returns
 */
export function MatchWith(
  property: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchWithConstraint,
    });
  };
}

/**
 * Match With Constraint
 */
@ValidatorConstraint({ name: 'matchWith' })
export class MatchWithConstraint implements ValidatorConstraintInterface {
  /**
   * @inheritdoc
   */
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }

  /**
   * @inheritdoc
   */
  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${relatedPropertyName} and ${args.property} do not match`;
  }
}
