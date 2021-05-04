import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { CheckEmailAvailabilityInputInterface } from '../interfaces';

/**
 * Check Email Availability Input
 */
@InputType()
export class CheckEmailAvailabilityInput
  implements CheckEmailAvailabilityInputInterface {
  @Field()
  @IsEmail(undefined, { message: 'The provided email address is not valid.' })
  readonly address: string;
}
