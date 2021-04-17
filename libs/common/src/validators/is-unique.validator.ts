import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationOptions,
} from 'class-validator';
import { Connection, EntitySchema, FindConditions, ObjectType } from 'typeorm';

type IsUniqueConstraints<T> = [
  ObjectType<T> | EntitySchema<T> | string,
  ((validationArguments: ValidationArguments) => FindConditions<T>) | keyof T,
];

interface IsUniqueValidationArguments<T> extends ValidationArguments {
  constraints: IsUniqueConstraints<T>;
}

/**
 * Match With Decorator
 *
 * @param {IsUniqueConstraints} constraints
 * @param {ValidationOptions} validationOptions
 * @returns
 */
export function IsUnique<T = any>(
  constraints: IsUniqueConstraints<T>,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints,
      validator: IsUniqueConstraint,
    });
  };
}

/**
 * Is Unique Validator
 */
@ValidatorConstraint({ name: 'isUnique', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  /**
   * Constructor
   *
   * @param {Connection} connection
   */
  constructor(@InjectConnection() private connection: Connection) {}

  /**
   * @inheritdoc
   */
  async validate<T>(value: string, args: IsUniqueValidationArguments<T>) {
    const [EntityClass, findCondition = args.property] = args.constraints;

    return (
      (await this.connection.getRepository(EntityClass).count({
        where:
          typeof findCondition === 'function'
            ? findCondition(args)
            : {
                [findCondition || args.property]: value,
              },
      })) <= 0
    );
  }

  /**
   * @inheritdoc
   */
  defaultMessage(args: ValidationArguments) {
    const [EntityClass] = args.constraints;
    const entity = EntityClass.name || 'Entity';
    return `${entity} with the same '${args.property}' already exist`;
  }
}
