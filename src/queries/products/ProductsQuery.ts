import gql from "graphql-tag";

export const ProductsQuery = gql`
  query ProductsQuery {
  products {
    edges {
      node {
        ... on SimpleProduct {
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
        }
      }
    }
  }
}
`;
