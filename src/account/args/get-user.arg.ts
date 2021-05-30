import { Field, ArgsType } from '@nestjs/graphql';

/**
 * Get User Args
 */
@ArgsType()
export class UserArgs {
  @Field()
  id: string;
}
