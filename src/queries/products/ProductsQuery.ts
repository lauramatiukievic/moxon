import gql from "graphql-tag";

export const ProductsQuery = gql`
  query ProductsQuery($categoryIds: [Int], $after: String, $before: String, $first: Int, $last: Int) {
  products(where: {categoryIdIn: $categoryIds}, after: $after, before: $before, first: $first, last: $last) {
    edges {
      cursor
      node {
        ... on VariableProduct {
          id
          name
          image {
            altText
            sourceUrl
          }
          price(format: RAW)
          averageRating
          reviewCount
          slug
          productCategories {
            edges {
              node {
                id
              }
            }
           
          }
        }
      }
    }
    pageInfo{
      endCursor
      startCursor
      hasNextPage
      hasPreviousPage
    }
  }
}
`;
