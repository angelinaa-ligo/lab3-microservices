import { gql } from "@apollo/client";

export const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $category: String!) {
    createPost(title: $title, content: $content, category: $category) {
      id
      title
      content
      category
    }
  }
`;export const CREATE_HELP_REQUEST = gql`
  mutation ($description: String!, $location: String) {
    createHelpRequest(description: $description, location: $location) {
      id
    }
  }
`;

export const RESOLVE_HELP_REQUEST = gql`
  mutation ($id: ID!) {
    resolveHelpRequest(id: $id) {
      id
      isResolved
    }
  }
`;