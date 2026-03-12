const typeDefs =`#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
  }

  type Mutation {
    signup(
      username: String!
      email: String!
      password: String!
      role: String!
    ): AuthPayload

    login(email: String!, password: String!): AuthPayload
    logout: Boolean
  }
`;

export default typeDefs;