import {
  Directive,
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
} from '@nestjs/graphql';
import { IEmailType, IUserType } from '../interfaces';
import { AccountType } from './account.type';
import { EmailType } from './email.type';

/**
 * User Type
 */
@ObjectType('User')
@Directive('@key(fields: "id")')
export class UserType implements IUserType {
  @Field(() => ID)
  id: string;

  @Field(() => [EmailType])
  emails: IEmailType[];

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
