import gql from "graphql-tag";

export const LoginMutation = gql`
  mutation LoginUser($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
      user {
        id
        name
      }
    }
  }
`