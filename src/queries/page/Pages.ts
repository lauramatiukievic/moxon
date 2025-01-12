import gql from "graphql-tag";

export const PagesQuery = gql`
query PagesQuery {
    pages {
      edges {
        node {
          id
          slug
          title
          content
        }
      }
    }
  }`