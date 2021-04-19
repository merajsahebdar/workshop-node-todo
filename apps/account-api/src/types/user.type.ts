import {
  Directive,
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
} from '@nestjs/graphql';
import { IUserType } from '../interfaces';
import { AccountType } from './account.type';

/**
 * User Type
 */
@ObjectType('User')
@Directive('@key(fields: "id")')
export class UserType implements IUserType {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  isActivated: boolean;

  @Field()
  isBlocked: boolean;

  @Field(() => AccountType)
  account: AccountType;

  @Field()
  isVerified: boolean;

  @Field(() => GraphQLISODateTime)
  createdAt: string;

  @Field(() => GraphQLISODateTime)
  updatedAt: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  removedAt?: string;
}
