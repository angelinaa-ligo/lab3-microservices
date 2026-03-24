
const typeDefs =`#graphql
  type CommunityPost {
  id: ID!
  title: String!
  content: String!
  category: String!
  authorName: String
  authorRole: String
  createdAt: String
}
  type User {
    id: ID!
    username: String!
    role: String!
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

  type AIResponse {
  text: String!
  suggestedQuestions: [String]!
  retrievedPosts: [CommunityPost]!
}

extend type Query {
  communityAIQuery(input: String!): AIResponse!
}
`;

export default typeDefs;