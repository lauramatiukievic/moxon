import gql from "graphql-tag";

export const WriteReview = gql`
  mutation WriteReview($input: WriteReviewInput!) {
    writeReview(input: $input) {
      review {
        id
        content
        author {
          name
          email
        }
      }
      rating
    }
  }
`;