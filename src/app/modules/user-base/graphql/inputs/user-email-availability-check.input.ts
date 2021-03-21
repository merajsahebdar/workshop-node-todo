import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { IUserEmailAvailabilityCheckInput } from '../../interfaces/user-email-availability-check.input';

/**
 * User Email Availability Check Input
 */
@InputType()
export class UserEmailAvailabilityCheckInput
  implements IUserEmailAvailabilityCheckInput {
  @Field()
  @IsEmail(undefined, { message: 'The provided email address is not valid.' })
  readonly email: string;
}
