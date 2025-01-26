import gql from "graphql-tag";

export const FilterQuerry = gql`
query FilterQuery {
    productCategories(first: 100) {
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
  