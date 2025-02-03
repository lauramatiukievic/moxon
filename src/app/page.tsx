import { fetchGraphQL } from '@/utils/fetchGraphQL'
import { ProductsQuery } from '@/queries/products/ProductsQuery'
import { print } from 'graphql'
import { PageInfo, VariableProduct } from '@/gql/graphql'
import { FilterQuerry } from '@/queries/products/FilterQuery'
import Products from '@/components/products'
import { Category } from '@/utils/common-types'


export default async function Example() {
  const categoryData = await fetchGraphQL<{ productCategories: { edges: { node: { id: string, name: string, parentId: string | null, databaseId: number } }[] } }>(print(FilterQuerry));

  const mainCategories = categoryData.productCategories.edges
  .filter(edge => edge.node.parentId === null)
  .map(edge => ({
    id: edge.node.databaseId,
    name: edge.node.name,
    options: categoryData.productCategories.edges
      .filter(optionEdge => optionEdge.node.parentId === edge.node.id)
      .map(optionEdge => ({
        value: optionEdge.node.databaseId,
        label: optionEdge.node.name,
        checked: false,
      })),
  })) as Category[];

  // console.log('main categories:', mainCategories)


  return (
    <Products categories={mainCategories} />
  )
}
