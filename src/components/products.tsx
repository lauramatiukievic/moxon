"use client"

import { VariableProduct } from "@/gql/graphql"
import { Category } from "@/utils/common-types"
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { PlusIcon, MinusIcon, XMarkIcon } from "@heroicons/react/24/outline"
import FilterButtons from "./filter-buttons"
import MobileDialog from "./productsdialog"
import ProductList from "./productsList"
import ProductsSort from "./productsSort"
import { SyntheticEvent, useEffect, useState } from "react"


export const extractLowestPrice = (price: string | null | undefined): number => {
  if (!price) return Infinity; // Use Infinity for products without a price
  const priceValues = price.split(',').map((p) => parseFloat(p.trim()) || Infinity);
  return Math.min(...priceValues);
};

interface Props {
  products: VariableProduct[],
  categories: Category[],
}

function Products({ products, categories }: Props) {
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<VariableProduct[]>(products);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const updateSelectedCategories = (updatedCategories: string[]) => {
    setSelectedCategories(updatedCategories);
    if (updatedCategories.length === 0) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.productCategories?.edges?.some((category) =>
          updatedCategories.includes(category.node.id)
        )
      );
      setFilteredProducts(filtered);
    }
  };

  const handleParentCategory = (categoryId: string, isOpen: boolean) => {
    const updatedCategories = isOpen
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId);
    updateSelectedCategories(updatedCategories);
  };

  const handleChildCategory = (event: SyntheticEvent<HTMLInputElement>, parentId: string) => {
    const categoryId = event.currentTarget.value;
    const isChecked = event.currentTarget.checked;

    const updatedCategories = isChecked
      ? [...selectedCategories.filter((id) => id !== parentId), categoryId]
      : selectedCategories.filter((id) => id !== categoryId);

    if (updatedCategories.length === 0) {
      updatedCategories.push(parentId);
    }

    updateSelectedCategories(updatedCategories);
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
              <div className="sm:col-span-3 md:col-span-3">
                <ProductList products={filteredProducts} />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}


export default Products
