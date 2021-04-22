import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { ICheckEmailAvailabilityInput } from '../interfaces';

/**
 * Check Email Availability Input
 */
@InputType()
export class CheckEmailAvailabilityInput
  implements ICheckEmailAvailabilityInput {
  @Field()
  @IsEmail(undefined, { message: 'The provided email address is not valid.' })
  readonly email: string;
}
