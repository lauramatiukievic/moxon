import { fetchGraphQL } from '@/utils/fetchGraphQL';
import { ProductQuery } from '@/queries/products/ProductQuery';
import { VariableProduct } from '@/gql/graphql';
import { print } from 'graphql';
import ProductInfo from '@/components/productInfo';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import ReviewsComponent from '@/components/reviews';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetail({ params }: Props) {
  const { slug } = await params;
  const { product } = await fetchGraphQL<{ product: VariableProduct }>(print(ProductQuery), { id: slug });

  const categories = product.productCategories?.edges.map(({ node }) =>
    node as { id: string; name: string; slug: string }
  );

  const images = product.galleryImages?.edges.map(({ node }) =>
    node as { id: string; altText: string, sourceUrl: string }
  )

  const allImages = [
    product.image
      ? {
        id: 'product-image', // Unique ID for the product image
        altText: product.image.altText || 'Main product image', // Fallback for altText
        sourceUrl: product.image.sourceUrl || '/placeholder.jpg', // Fallback for sourceUrl
      }
      : null,
    ...(images || []),
  ].filter((image): image is { id: string; altText: string; sourceUrl: string } => Boolean(image));

  // console.log(product.galleryImages?.edges)

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:max-w-7xl lg:px-8">
        {/* Breadcrumb */}
        {categories && categories.length > 0 && (
          <nav className="text-sm mb-6">
            <ul className="flex space-x-2 text-gray-500">
              {categories.map((category, index) => (
                <li key={category.id} className="flex items-center">
                  <a href={`/category/${category.slug}`} className="hover:text-gray-700">
                    {category.name}
                  </a>
                  {index < categories.length - 1 && <span className="mx-2">/</span>}
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Product Gallery */}
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {allImages && allImages.length > 0 ? (
            <TabGroup className="flex flex-col-reverse">
              {/* TabList */}
              <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                <TabList className="grid grid-cols-4 gap-6">
                  {allImages.map((image) => (
                    <Tab
                      key={image.id}
                      className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-indigo-500/50 focus:ring-offset-4"
                    >
                      <span className="absolute inset-0 overflow-hidden rounded-md">
                        <img
                          alt={image.altText || "Gallery Image"}
                          src={image.sourceUrl || "/placeholder.jpg"}
                          className="size-full object-cover"
                        />
                      </span>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-[selected]:ring-indigo-500"
                      />
                    </Tab>
                  ))}
                </TabList>
              </div>

              {/* TabPanels */}
              <TabPanels>
                {allImages.map((image) => (
                  <TabPanel key={image.id}>
                    <img
                      alt={image.altText || "Gallery Image"} 
                      src={image.sourceUrl || "/placeholder.jpg"} 
                      className="aspect-square w-full object-cover sm:rounded-lg"
                    />
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>
          ) : (

            <div className="overflow-hidden rounded-lg border border-gray-200">
              <img
                alt={product.image?.altText || "Product image"}
                src={product.image?.sourceUrl || "/placeholder.jpg"}
                className="h-full w-full object-cover object-center"
              />
            </div>
          )}

          {/* Product Info */}
          <div className="mt-10 lg:mt-0">
            <ProductInfo product={product} />
          </div>
        </div>


        <div className="mt-12">
          <ReviewsComponent product={product} />
        </div>


      </div>
    </div>
  );
}
