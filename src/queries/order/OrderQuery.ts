import gql from "graphql-tag";

export const CREATE_ORDER_MUTATION = gql`
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    order {
      id
      total
      status
    }
  }
}
`;