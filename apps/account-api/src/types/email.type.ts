import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { GraphEmailInterface } from '../interfaces';

/**
 * Email
 */
@ObjectType('Email')
export class GraphEmail implements GraphEmailInterface {
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
  deletedAt?: string;
}
