import {ContainerType, buildSchema} from 'type-graphql';
import {GraphQLSchema} from 'graphql';

// Schema Options
type SchemaOptions = {
  container?: ContainerType;
};

/**
 * Create Schema
 *
 * @returns {Promise<graphql.GraphQLSchema>}
 * @memberof Schema
 */
async function createSchema(options: SchemaOptions = {}): Promise<GraphQLSchema> {
  return await buildSchema({
    resolvers: [],
    container: options.container,
  });
}

// DEFAULT EXPORT
export default createSchema;
