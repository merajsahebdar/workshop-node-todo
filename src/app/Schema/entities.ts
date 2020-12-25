import {
  ObjectType,
  InputType,
  InterfaceType,
  Field,
  GraphQLISODateTime,
  Int,
  registerEnumType,
} from 'type-graphql';
import {Filter, generateFilterType} from 'type-graphql-filter';
import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column} from 'typeorm';

import {StatusOfTodo} from './types';

// Register Enums
registerEnumType(StatusOfTodo, {
  name: 'StatusOfTodo',
});

/**
 * Node
 */
@InterfaceType()
export abstract class Node {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @CreateDateColumn({name: 'createdAt'})
  @Field(() => GraphQLISODateTime)
  createdAt: string;

  @UpdateDateColumn({name: 'updatedAt'})
  @Field(() => GraphQLISODateTime)
  updatedAt: string;
}

/**
 * Removed Node
 */
@ObjectType()
export class RemovedNode {
  @Field(() => Int)
  id: number;

  @Field()
  type: string;
}

/**
 * Todo
 */
@Entity({name: 'todos'})
@ObjectType('Todo', {implements: Node})
export class Todo extends Node {
  @Field(() => Int)
  id: number;

  @Field(() => GraphQLISODateTime)
  createdAt: string;

  @Field(() => GraphQLISODateTime)
  updatedAt: string;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field(() => StatusOfTodo)
  @Filter('eq')
  status: StatusOfTodo;
}

/**
 * Todo Filter
 */
export const TodoFilter = generateFilterType(Todo);

/**
 * Create Todo Input
 */
@InputType()
export class CreateTodoInput {
  @Field()
  title: string;

  @Field(() => StatusOfTodo, {nullable: true, defaultValue: StatusOfTodo.IDLE})
  status: StatusOfTodo;
}

/**
 * Update Todo Input
 */
@InputType()
export class UpdateTodoInput {
  @Field(() => Int)
  id: number;

  @Field({nullable: true})
  title?: string;

  @Field(() => StatusOfTodo, {nullable: true})
  status?: StatusOfTodo;
}

/**
 * Remove Todo Input
 */
@InputType()
export class RemoveTodoInput {
  @Field(() => Int)
  id: number;
}

// DEFAULT EXPORT
export default [Todo];
