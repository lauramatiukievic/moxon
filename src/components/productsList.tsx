"use client";
import { VariableProduct } from '@/gql/graphql';
import { StarIcon } from '@heroicons/react/20/solid'
import { useMobileContext } from './mobileContext';
import { extractLowestPrice } from './products';



function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface Props {
    products: VariableProduct[]
}


export default function ProductList({ products }: Props) {

  if (!Array.isArray(products)) {
    return <div>No products available</div>;
  }

  console.log(products)

  const { sortOrder } = useMobileContext()

  const sortedProducts = [...products].sort((a, b) => {
    const priceA = extractLowestPrice(a.price);
    const priceB = extractLowestPrice(b.price);
  
    return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
  });
  
  

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
          {sortedProducts.map((product) => (
            <div key={product.id} className="group relative border-b border-r border-gray-200 p-4 sm:p-6">
              <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                <img
                  alt={product.image!.altText!}
                  src={product.image!.sourceUrl!}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="pb-4 pt-10 text-center">
                <h3 className="text-sm font-medium text-gray-900">
                  <a href={`/products/${product.slug}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </a>
                </h3>
                <div className='justify-end'>
                  <div className="mt-3 flex flex-col items-center">
                    <p className="sr-only">{product.averageRating} out of 5 stars</p>
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          aria-hidden="true"
                          className={classNames(
                            product.averageRating && product.averageRating > rating ? 'text-yellow-400' : 'text-gray-200',
                            'h-5 w-5 flex-shrink-0',
                          )}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{product.reviewCount} reviews</p>
                  </div>
<p className="mt-4 text-base font-medium text-gray-900">
  {extractLowestPrice(product.price) === Infinity ? 'N/A' : `${extractLowestPrice(product.price)} €`}
</p>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
