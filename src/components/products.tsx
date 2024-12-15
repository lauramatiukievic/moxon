"use client"

import {  VariableProduct } from "@/gql/graphql"
import { Category } from "@/utils/common-types"
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline"
import FilterButtons from "./filter-buttons"
import MobileDialog from "./productsdialog"
import ProductList from "./productsList"
import ProductsSort from "./productsSort"
import { SyntheticEvent, useState } from "react"

interface Props {
    products: VariableProduct[],
    categories: Category[],
}

function Products
    ({ products, categories }: Props) {

        if (!products || !categories) {
            return null;
        }

    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [filteredProducts, setFilteredProducts] = useState<VariableProduct[]>(products)

    const updateSelectedCategories = (updatedCategories: string[]) => {
        setSelectedCategories(updatedCategories);
    
        // Filter products based on the selected categories
        if (updatedCategories.length === 0) {
          setFilteredProducts(products); // Show all products if no category is selected
        } else {
          const filtered = products.filter((product) =>
            product.productCategories?.edges?.some((category) =>
              updatedCategories.includes(category.node.id)
            )
          );
          setFilteredProducts(filtered);
        }
      };
    
      // Handle parent category selection
      const handleParentCategory = (categoryId: string, isOpen: boolean) => {
        const updatedCategories = isOpen
          ? [...selectedCategories, categoryId] // Add parent category if opened
          : selectedCategories.filter((id) => id !== categoryId); // Remove parent category if closed
    
        updateSelectedCategories(updatedCategories);
      };
    
      // Handle child category selection
      const handleChildCategory = (event: SyntheticEvent<HTMLInputElement>, parentId: string) => {
        const categoryId = event.currentTarget.value;
        const isChecked = event.currentTarget.checked;
    
        // Remove parent category if any child is selected, and add/remove child category
        const updatedCategories = isChecked
          ? [...selectedCategories.filter((id) => id !== parentId), categoryId] // Remove parent, add child
          : selectedCategories.filter((id) => id !== categoryId); // Remove child if unchecked

        if (updatedCategories.length === 0) {
            updatedCategories.push(parentId)
        }
    
        updateSelectedCategories(updatedCategories);
      };


    return (
        <div className="bg-white">
            <div>
                {/* Mobile filter dialog */}


                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-12">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Produktai</h1>
                        <MobileDialog />
                        <div className='gap-2'>
                            <FilterButtons />
                            <ProductsSort />
                        </div>
                    </div>

                    <section aria-labelledby="products-heading" className="pb-24 pt-6">
                        <h2 id="products-heading" className="sr-only">
                            Products
                        </h2>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                            {/* Filters */}
                            <form className="hidden lg:block">
                                {categories.map((section) => (
                                    <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-6">
                                        {({ open }) => (
                                            <>
                                                <h3 className="-my-3 flow-root">
                                                    <DisclosureButton onClick={() => handleParentCategory(section.id, !open)} className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                                        <span className="font-medium text-gray-900">{section.name}</span>
                                                        <span className="ml-6 flex items-center">
                                                            <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                                                            <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                                                        </span>
                                                    </DisclosureButton>
                                                </h3>
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
                                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                />
                                                                <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
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

                            {/* Product grid */}
                            <div className="lg:col-span-3">{/* Your content */}
                                <ProductList products={filteredProducts} />
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
export default Products
