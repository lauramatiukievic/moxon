import gql from "graphql-tag";

export const GetProductReviews = gql`
  query GetProductReviews($productId: ID!) {
    product(id: $productId) {
      averageRating
    reviews {
      nodes {
        id
        content
        author {
          name
        }
      }
      edges {
        rating
      }
    }
  }
  }
`;