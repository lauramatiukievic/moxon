import gql from "graphql-tag";

export const PageQuery = gql`
query PageById($id: ID!) {
    page(id: $id) {
      id
      title
      content
      slug
    }
  }`