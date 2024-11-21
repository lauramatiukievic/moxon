import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import {  MinusIcon, PlusIcon} from '@heroicons/react/20/solid'
import ProductList from '@/components/productsList'
import { fetchGraphQL } from '@/utils/fetchGraphQL'
import { ProductsQuery } from '@/queries/products/ProductsQuery'
import { print } from 'graphql'
import { VariableProduct } from '@/gql/graphql'
import MobileDialog from '@/components/productsdialog'
import FilterButtons from '@/components/filter-buttons'
import ProductsSort from '@/components/productsSort'
import { FilterQuerry } from '@/queries/products/FilterQuery'
import { useState } from 'react'
import Products from '@/components/products'
import { Category } from '@/utils/common-types'


export default async function Example() {

  const { products } = await fetchGraphQL<{ products: { edges: { node: VariableProduct }[] } }>(print(ProductsQuery), {categoryIds: []});

  const productList = products.edges.map(edge => edge.node);

  const { productCategories } = await fetchGraphQL<{ productCategories: { edges: { node: { id: string, name: string, parentId: string | null, databaseId: number } }[] } }>(print(FilterQuerry));

  const mainCategories = productCategories.edges
  .filter(edge => edge.node.parentId === null)
  .map(edge => ({
    id: edge.node.id,
    name: edge.node.name,
    options: productCategories.edges
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
