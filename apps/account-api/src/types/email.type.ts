import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { IEmailType } from '../interfaces';

/**
 * Email Type
 */
@ObjectType('Email')
export class EmailType implements IEmailType {
  @Field()
  id: string;

  @Field()
  address: string;

  @Field()
  isPrimary: boolean;

  @Field()
  isVerified: boolean;

  @Field(() => GraphQLISODateTime)
  createdAt: string;

  @Field(() => GraphQLISODateTime)
  updatedAt: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  removedAt?: string;
}
