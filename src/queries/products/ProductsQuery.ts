import gql from "graphql-tag";

export const ProductsQuery = gql`
  query ProductsQuery($categoryIds: [Int]) {
  products(where: {categoryIdIn: $categoryIds}) {
    edges {
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
  }
}
`;
