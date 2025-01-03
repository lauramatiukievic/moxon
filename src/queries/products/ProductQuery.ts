import gql from "graphql-tag";

// queries/productQueries.ts
export const ProductQuery = gql`
  query PageQuery($id: ID!) {
    product(idType: SLUG, id: $id) {
      ... on VariableProduct {
        id
        name
        databaseId
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
              databaseId
              attributes {
                nodes {
                  name
                  value
                }
              }
            }
          }
        }
        galleryImages {
            edges {
              node {
                id
                sourceUrl
                altText
              }
            }
          }
          productCategories {
            edges {
              node {
                id
                slug
                name
              }
            }
          }
      }
    }
  }
`;

