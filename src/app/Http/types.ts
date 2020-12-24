import type {GraphQLSchema} from 'graphql';

// Server Config
export type ServerConfig = {
  schema: GraphQLSchema;
};

// Server
export type Server = {
  close: () => void;
};
