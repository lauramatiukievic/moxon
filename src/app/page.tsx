import { fetchGraphQL } from '@/utils/fetchGraphQL'
import { ProductsQuery } from '@/queries/products/ProductsQuery'
import { print } from 'graphql'
import { VariableProduct } from '@/gql/graphql'
import { FilterQuerry } from '@/queries/products/FilterQuery'
import Products from '@/components/products'
import { Category } from '@/utils/common-types'


export default async function Example() {

  const productData = await fetchGraphQL<{ products: { edges: { node: VariableProduct }[] } }>(print(ProductsQuery), {categoryIds: []});
  const categoryData = await fetchGraphQL<{ productCategories: { edges: { node: { id: string, name: string, parentId: string | null, databaseId: number } }[] } }>(print(FilterQuerry));

  const productList = productData.products.edges.map(edge => edge.node);

  const mainCategories = categoryData.productCategories.edges
  .filter(edge => edge.node.parentId === null)
  .map(edge => ({
    id: edge.node.id,
    name: edge.node.name,
    options: categoryData.productCategories.edges
      .filter(optionEdge => optionEdge.node.parentId === edge.node.id)
      .map(optionEdge => ({
        value: optionEdge.node.id,
        label: optionEdge.node.name,
        checked: false,
      })),
  })) as Category[];


  return (
    <Products products={productList} categories={mainCategories} />
  )
}
