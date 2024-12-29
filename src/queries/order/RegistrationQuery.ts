import gql from "graphql-tag";

export const RegistrationQuery = gql`
 mutation RegisterUser($username: String!, $email: String!, $password: String!) {
    registerUser(input: { username: $username, email: $email, password: $password }) {
      user {
        jwtAuthToken
        jwtRefreshToken
      }
    }
  }

`