
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react';
import { StarIcon } from '@heroicons/react/20/solid';
import { fetchGraphQL } from '@/utils/fetchGraphQL'; 
import { ProductQuery } from '@/queries/products/ProductQuery'; // Import your GraphQL query for fetching product by slug
import { SimpleProduct } from '@/gql/graphql';
import { print } from 'graphql';
import { useState } from 'react';
import { FavProduct, ProductButtons } from '@/components/productButton';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
interface Props {
  params: { slug: string };
}


export default async function  ProductDetail({ params }: Props) {
  const { slug } = params;
  
  const { product } = await fetchGraphQL<{ product: SimpleProduct }>(print(ProductQuery), {id: slug})

  console.log(product)

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <TabGroup className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <TabList className="grid grid-cols-4 gap-6">
                <Tab
                  key={product.id}
                  className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                >
                  <span className="sr-only">{product.name}</span>
                  <span className="absolute inset-0 overflow-hidden rounded-md">
                    <img alt={product.image!.altText!} src={product.image!.sourceUrl!} className="h-full w-full object-cover object-center" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-[selected]:ring-indigo-500"
                  />
                </Tab>
              </TabList>
            </div>

            <TabPanels className="aspect-h-1 aspect-w-1 w-full">
              <TabPanel key={product.id}>
                <img
                  alt={product.image!.altText!} 
                  src={product.image!.sourceUrl!}
                  className="h-full w-full object-cover object-center sm:rounded-lg"
                />
              </TabPanel>
            </TabPanels>
          </TabGroup>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
            <FavProduct/>
            </div>
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">{product.price} €</p>
            
            </div>

            {/* Reviews */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={classNames(
                        product.averageRating && product.averageRating > rating ? 'text-indigo-500' : 'text-gray-300',
                        'h-5 w-5 flex-shrink-0',
                      )}
                    />
                  ))}
                </div>
                <p className="sr-only">{product.averageRating} out of 5 stars</p>
              </div>
            </div>
         
            <p className=" mt-4 tracking-tight text-gray-700">10 ml.</p>

            <div className="mt-2 space-y-6 text-base text-gray-700"   dangerouslySetInnerHTML={{ __html: product.description || '' }}/>

            <form className="mt-6">
              <div className="mt-10 flex">
                  <ProductButtons product={product}/>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
