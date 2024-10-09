import gql from "graphql-tag";

// queries/productQueries.ts

export const ProductQuery = gql`
  query PageQuery($id: ID!) {
    product(idType: SLUG, id: $id) {
      ... on SimpleProduct {
        id
        name
        description
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
`;
