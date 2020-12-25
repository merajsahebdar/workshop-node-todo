import {UserInputError} from 'apollo-server-express';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsList} from 'graphql-fields-list';
import {
  FieldResolver,
  Resolver,
  ResolverInterface,
  Root,
  Query,
  Mutation,
  Arg,
  Int,
  Info,
} from 'type-graphql';
import {Repository} from 'typeorm';
import {InjectRepository} from 'typeorm-typedi-extensions';

import {
  Todo,
  CreateTodoInput,
  TodoFilter,
  UpdateTodoInput,
  RemoveTodoInput,
  RemovedNode,
} from '../entities';

/**
 * Todo Resolver
 *
 * @memberof App/Schema/Resolver
 */
@Resolver(Todo)
class TodoResolver implements ResolverInterface<Todo> {
  /**
   * Constructor
   */
  constructor(@InjectRepository(Todo) private todosRepository: Repository<Todo>) {}

  /**
   * ID
   */
  @FieldResolver()
  id(@Root() root: Todo): number {
    return root.id;
  }

  /**
   * Todos
   *
   * @returns {Promise<Todo[]>}
   */
  @Query(() => [Todo])
  async todos(
    @Arg('filter', TodoFilter, {nullable: true}) filter: any = {},
    @Info() info: GraphQLResolveInfo
  ): Promise<Todo[]> {
    const query = this.todosRepository.createQueryBuilder();

    const fields = fieldsList(info).filter(f => f !== '__typename');
    query.select(fields);

    if (filter.status_eq) {
      query.where({status: filter.status_eq});
    }

    query.orderBy('createdAt', 'DESC');

    return await query.execute();
  }

  /**
   * Todos Count
   *
   * @returns {Promise<number>}
   */
  @Query(() => Int)
  async todosCount(@Arg('filter', TodoFilter, {nullable: true}) filter: any = {}): Promise<number> {
    const query = this.todosRepository.createQueryBuilder();

    if (filter.status_eq) {
      query.where({status: filter.status_eq});
    }

    return await query.getCount();
  }

  /**
   * Create Todo
   *
   * @param {CreateTodoInput} input
   * @returns {Promise<Todo>}
   */
  @Mutation(() => Todo)
  async createTodo(@Arg('input') input: CreateTodoInput): Promise<Todo> {
    const todo = new Todo();
    todo.title = input.title;
    todo.status = input.status;

    return await this.todosRepository.save(todo);
  }

  /**
   * Update Todo
   *
   * @param {UpdateTodoInput} input
   * @returns {Promise<Todo>}
   * @throws {UserInputError}
   */
  @Mutation(() => Todo)
  async updateTodo(@Arg('input') input: UpdateTodoInput): Promise<Todo> {
    const todo = await this.todosRepository.findOne(input.id);

    if (!todo) {
      throw new UserInputError(`No such todo found with id: '${input.id}'`);
    }

    if (input.title) {
      todo.title = input.title;
    }

    if (input.status) {
      todo.status = input.status;
    }

    return await this.todosRepository.save(todo);
  }

  /**
   * Remove Todo
   *
   * @param {RemoveTodoInput} input
   * @returns {Promise<RemovedNode>}
   * @throws {UserInputError}
   */
  @Mutation(() => RemovedNode)
  async removeTodo(@Arg('input') input: RemoveTodoInput): Promise<RemovedNode> {
    const todo = await this.todosRepository.findOne(input.id);

    if (!todo) {
      throw new UserInputError(`No such todo found with id: '${input.id}'`);
    }

    await this.todosRepository.remove(todo);

    return {
      id: input.id,
      type: 'Todo',
    };
  }
}

// DEFAULT EXPORT
export default TodoResolver;
