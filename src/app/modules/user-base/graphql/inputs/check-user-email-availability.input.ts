import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { ICheckUserEmailAvailabilityInput } from '../../typing';

/**
 * Check User Email Availability Input
 */
@InputType()
export class CheckUserEmailAvailabilityInput
  implements ICheckUserEmailAvailabilityInput {
  @Field()
  @IsEmail(undefined, { message: 'The provided email address is not valid.' })
  readonly email: string;
}
