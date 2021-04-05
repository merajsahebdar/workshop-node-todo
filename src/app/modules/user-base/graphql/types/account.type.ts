import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { IAccountType } from '../../typing';

/**
 * Account Type
 */
@ObjectType('Account')
export class AccountType implements IAccountType {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field()
  forename: string;

  @Field()
  surname: string;

  @Field(() => GraphQLISODateTime)
  createdAt: string;

  @Field(() => GraphQLISODateTime)
  updatedAt: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  removedAt: string;
}
