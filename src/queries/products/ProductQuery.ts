import gql from "graphql-tag";

// queries/productQueries.ts
export const ProductQuery = gql`
  query PageQuery($id: ID!) {
    product(idType: SLUG, id: $id) {
      ... on VariableProduct {
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
        attributes {
          nodes {
            name
            options
          }
        }
        shortDescription
        variations {
          edges {
            node {
              id
              price(format: RAW)
              stockQuantity
              attributes {
                nodes {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;
