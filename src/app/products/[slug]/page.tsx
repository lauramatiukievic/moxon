// ProductDetail.tsx
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import { ProductQuery } from '@/queries/products/ProductQuery';
import { VariableProduct } from '@/gql/graphql';
import { print } from 'graphql';
import ProductInfo from '@/components/productInfo';

interface Props {
  params: { slug: string };
}

export default async function ProductDetail({ params }: Props) {
  const { slug } = params;
  const { product } = await fetchGraphQL<{ product: VariableProduct }>(print(ProductQuery), { id: slug });

  

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
                    <img
                      alt={product.image!.altText!}
                      src={product.image!.sourceUrl!}
                      className="h-full w-full object-cover object-center"
                    />
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
            <ProductInfo product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
