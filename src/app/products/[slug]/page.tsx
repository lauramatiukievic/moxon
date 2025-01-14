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

  const categories = product.productCategories?.edges.map(({ node }) =>
    node as { id: string; name: string; slug: string }
  );

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
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <img
              alt={product.image?.altText || 'Product image'}
              src={product.image?.sourceUrl || ''}
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* Product Info */}
          <div className="mt-10 lg:mt-0">
            <ProductInfo product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
