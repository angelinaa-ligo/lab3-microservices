
const typeDefs =`#graphql
  type CommunityPost {
    id: ID!
    title: String!
    content: String!
    category: String!
    aiSummary: String
    createdAt: String
    updatedAt: String
  }

  type HelpRequest {
    id: ID!
    description: String!
    location: String
    isResolved: Boolean
    createdAt: String
    updatedAt: String
  }

  type Query {
    posts(category: String): [CommunityPost]
    helpRequests: [HelpRequest]
  }

  type Mutation {
    createPost(
      title: String!
      content: String!
      category: String!
    ): CommunityPost

    createHelpRequest(
      description: String!
      location: String
    ): HelpRequest

    resolveHelpRequest(id: ID!): HelpRequest
  }
`;

export default typeDefs;