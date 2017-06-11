import { readFileSync } from 'fs';
import { resolve } from 'path';
import { makeExecutableSchema } from 'graphql-tools';

const gql = [String(readFileSync(resolve(__dirname, './types.gql')))];
const rootSchema = [`
  # Headliner GraphQL
  type Query {    
    post(id: String!): Post
  }

  schema {
    query: Query
  }
`];

const schema = [
  ...rootSchema,
  ...gql
];

const resolvers = {
  Query: {
    post(root, { id }, context) {
      return context.posts.getPostByID(id);
    }
  }
};

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
  allowUndefinedInResolve: true
});

export default executableSchema;
