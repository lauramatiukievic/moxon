"use client"
import { fetchGraphQL } from '@/utils/fetchGraphQL'
import { print } from 'graphql'
import { PageInfo, VariableProduct } from "@/gql/graphql"
import { Category } from "@/utils/common-types"
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { PlusIcon, MinusIcon, XMarkIcon } from "@heroicons/react/24/outline"
import FilterButtons from "./filter-buttons"
import ProductList from "./productsList"
import { SyntheticEvent, useCallback, useEffect, useState } from "react"
import { ProductsQuery } from '@/queries/products/ProductsQuery'


export const extractLowestPrice = (price: string | null | undefined): number => {
  if (!price) return Infinity; // Use Infinity for products without a price
  const priceValues = price.split(',').map((p) => parseFloat(p.trim()) || Infinity);
  return Math.min(...priceValues);
};

interface Props {
  categories: Category[],
}

function Products({categories }: Props) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [products, setProducts] = useState<VariableProduct[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all products on initial mount
    // console.log('fetching:', selectedCategories)
    fetchProducts();
    
  }, [selectedCategories]);
  

  const fetchProducts = useCallback(
    async (after?: string) => {
      setLoading(true);
  
      try {
        const variables = {
          categoryIds: selectedCategories.length ? selectedCategories : undefined, // Apply category filter
          first: 5, // Number of products to fetch
          after,    // Cursor for pagination
        };
  
        const productData = await fetchGraphQL<{
          products: { edges: { node: VariableProduct }[]; pageInfo: PageInfo };
        }>(print(ProductsQuery), variables);
  
        const newProducts = productData.products.edges.map((edge) => edge.node);
        // console.log('newProducts', newProducts)
        // console.log('current products: ', products)
  
        setProducts((prev) => {
          // Append if paginating (after exists), otherwise overwrite
          return after ? [...prev, ...newProducts] : newProducts;
        });
  
        // Update pageInfo for pagination
        setPageInfo(productData.products.pageInfo);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    },
    [selectedCategories]
  );
  
  
  
  const loadMoreProducts = useCallback(() => {
    if (pageInfo?.hasNextPage && pageInfo.endCursor) {
      fetchProducts(pageInfo.endCursor);
    }
  }, [pageInfo, fetchProducts]);

  const handleParentCategory = (categoryId: number, isOpen: boolean) => {
    setSelectedCategories((prev) => {
      const updatedCategories = isOpen
        ? [...prev, categoryId] // Add category if expanded
        : prev.filter((id) => id !== categoryId); // Remove category if collapsed
      return updatedCategories;
    });
  };

  const handleChildCategory = (event: SyntheticEvent<HTMLInputElement>, parentCategoryId: number) => {
    const categoryId = Number(event.currentTarget.value);
    const isChecked = event.currentTarget.checked;
  
    setSelectedCategories((prev) => {
      // Remove the parent category and the specific child category being toggled
      const updatedCategories = prev.filter((id) => id !== parentCategoryId && id !== categoryId);
  
      if (isChecked) {
        // Add only the selected child category
        return [...updatedCategories, categoryId];
      } else {
        // If no child categories are selected, re-add the parent category ID
        const parentHasSelectedChildren = categories
          .find((category) => category.id === parentCategoryId)
          ?.options.some((option) => updatedCategories.includes(option.value));
  
        if (!parentHasSelectedChildren) {
          return [...updatedCategories, parentCategoryId];
        }
  
        return updatedCategories;
      }
    });
  };
  
  

  return (
    <div className="bg-white">
      <div>
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-12">
            <h1 className="text-2xl sm:text-4xl   font-bold tracking-tight text-gray-900">Produktai</h1>
            <FilterButtons setMobileFiltersOpen={setMobileFiltersOpen} />
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">Products</h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-1 md:grid-cols-4">
              {/* Mobile Filter Panel */}
              {mobileFiltersOpen && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-500"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Filtrai</h2>
                    <div>
                      {categories.map((section) => (
                        <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-4">
                          {({ open }) => (
                            <>
                              <DisclosureButton
                                onClick={() => handleParentCategory(section.id, !open)}
                                className="flex w-full items-center justify-between text-sm font-medium text-gray-900"
                              >
                                {section.name}
                                <span className="ml-6 flex items-center">
                                  {open ? <MinusIcon stroke="purple"  className="h-5 w-5" /> : <PlusIcon stroke="purple"  className="h-5 w-5" />}
                                </span>
                              </DisclosureButton>
                              <DisclosurePanel className="pt-4">
                                <div className="space-y-2">
                                  {section.options.map((option) => (
                                    <div key={option.value} className="flex items-center">
                                      <input
                                        onChange={(e) => handleChildCategory(e, section.id)}
                                        defaultValue={option.value}
                                        defaultChecked={option.checked}
                                        id={`mobile-filter-${section.id}-${option.value}`}
                                        name={`${section.id}[]`}
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                      />
                                      <label
                                        htmlFor={`mobile-filter-${section.id}-${option.value}`}
                                        className="ml-2 text-sm text-gray-600"
                                      >
                                        {option.label}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </DisclosurePanel>
                            </>
                          )}
                        </Disclosure>
                      ))}
                    </div>
                    <button
                      className="mt-6 w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      Taikyti filtrus
                    </button>
                  </div>
                </div>
              )}


              {/* Desktop Filters */}
              <form className="hidden md:block">
                {categories.map((section) => (
                  <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-6">
                    {({ open }) => (
                      <>
                        <DisclosureButton
                          onClick={() => handleParentCategory(section.id, !open)}
                          className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
                        >
                          <span className="font-medium text-gray-900">{section.name}</span>
                          <span className="ml-6 flex items-center">
                            {open ? <MinusIcon stroke="purple"  className="h-5 w-5" /> : <PlusIcon stroke="purple" className="h-5 w-5" />}
                          </span>
                        </DisclosureButton>
                        <DisclosurePanel className="pt-6">
                          <div className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div key={option.value} className="flex items-center">
                                <input
                                  onChange={(e) => handleChildCategory(e, section.id)}
                                  defaultValue={option.value}
                                  defaultChecked={option.checked}
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 text-sm text-gray-600"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>

              {/* Product Grid */}
              <div className=" flex flex-col items-center sm:col-span-3 md:col-span-3">
                <ProductList  products={products} />
                {pageInfo?.hasNextPage && (
        <button
          onClick={loadMoreProducts}
          disabled={loading}
          className="mt-4 rounded-md bg-purple-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Loading..." : "Daugiau prekių"}
        </button>
      )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}


export default Products
