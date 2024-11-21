import gql from "graphql-tag";

export const FilterQuerry = gql`
query FilterQuery {
    productCategories {
      edges {
        node {
          id
          name
          parentId
          databaseId
        }
      }
    }
  }`;
  