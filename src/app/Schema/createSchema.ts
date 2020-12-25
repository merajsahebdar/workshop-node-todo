import {ContainerType, buildSchema} from 'type-graphql';
import {GraphQLSchema} from 'graphql';

import TodoResolver from './Resolver/TodoResolver';

// Schema Options
type SchemaOptions = {
  container?: ContainerType;
};

/**
 * Create Schema
 *
 * @returns {Promise<graphql.GraphQLSchema>}
 * @memberof App/Schema
 */
async function createSchema(options: SchemaOptions = {}): Promise<GraphQLSchema> {
  return await buildSchema({
    resolvers: [TodoResolver],
    container: options.container,
    validate: false,
  });
}

// DEFAULT EXPORT
export default createSchema;
