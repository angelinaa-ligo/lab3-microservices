import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query {
    posts {
      id
    title
    content
    category
    authorName
    authorRole
      }
    }
`;
export const GET_ME = gql`
  query {
    me {
      id
      username
      email
      role
    }
  }
`;
export const GET_HELP_REQUESTS = gql`
  query {
    helpRequests {
      id
      description
      location
      isResolved
    }
  }
`;

export const COMMUNITY_AI_QUERY = gql`
  query CommunityAIQuery($input: String!) {
    communityAIQuery(input: $input) {
      text
      suggestedQuestions
      retrievedPosts {
        id
        title
        content
        authorName
      }
    }
  }
`;