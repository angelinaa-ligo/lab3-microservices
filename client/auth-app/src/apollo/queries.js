import { gql } from "@apollo/client";

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