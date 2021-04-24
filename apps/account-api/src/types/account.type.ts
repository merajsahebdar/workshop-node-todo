import {
  Directive,
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
} from '@nestjs/graphql';
import { IAccountType } from '../interfaces';

/**
 * Account Type
 */
@ObjectType('Account')
@Directive('@key(fields: "id")')
export class AccountType implements IAccountType {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  forename?: string;

  @Field({ nullable: true })
  surname?: string;

  @Field({ nullable: true })
  nickname?: string;

  @Field(() => GraphQLISODateTime)
  createdAt: string;

  @Field(() => GraphQLISODateTime)
  updatedAt: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  removedAt: string;
}
