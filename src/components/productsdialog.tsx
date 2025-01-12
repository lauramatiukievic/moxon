'use client'
import { Dialog, DialogBackdrop, DialogPanel, Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export const filters = [
    {
      id: 'color',
      name: 'Veidui',
      options: [
        { value: 'white', label: 'White', checked: false },
        { value: 'beige', label: 'Beige', checked: false },
        { value: 'blue', label: 'Blue', checked: true },
        { value: 'brown', label: 'Brown', checked: false },
        { value: 'green', label: 'Green', checked: false },
        { value: 'purple', label: 'Purple', checked: false },
      ],
    },
    {
      id: 'size',
      name: 'Plaukams',
      options: [
        { value: '2l', label: '2L', checked: false },
        { value: '6l', label: '6L', checked: false },
        { value: '12l', label: '12L', checked: false },
        { value: '18l', label: '18L', checked: false },
        { value: '20l', label: '20L', checked: false },
        { value: '40l', label: '40L', checked: true },
      ],
    },
  ]
// export const subCategories = [
//     { name: 'Veidui', href: '#' },
//     { name: 'Plaukams', href: '#' },
//     { name: 'Kūnui', href: '#' },
//   ]
  
const MobileDialog = ()=>{
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    return (
    <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
<DialogBackdrop
  transition
  className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
/>

<div className="fixed inset-0 z-40 flex">
  <DialogPanel
    transition
    className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
  >
    <div className="flex items-center justify-between px-4">
      <h2 className="text-lg font-medium text-gray-900">Filters</h2>
      <button
        type="button"
        onClick={() => setMobileFiltersOpen(false)}
        className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
      >
        <span className="sr-only">Close menu</span>
        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
      </button>
    </div>

    {/* Filters */}
    <form className="mt-4 border-t border-gray-200">
      <h3 className="sr-only">Categories</h3>
      {/* <ul role="list" className="px-2 py-3 font-medium text-gray-900">
        {subCategories.map((category) => (
          <li key={category.name}>
            <a href={category.href} className="block px-2 py-3">
              {category.name}
            </a>
          </li>
        ))}
      </ul> */}

      {filters.map((section) => (
        <Disclosure key={section.id} as="div" className="border-t border-gray-200 px-4 py-6">
          <h3 className="-mx-2 -my-3 flow-root">
            <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
              <span className="font-medium text-gray-900">{section.name}</span>
              <span className="ml-6 flex items-center bg-violet-500">
                <PlusIcon aria-hidden="true" stroke="violet" className="h-5 w-5 group-data-[open]:hidden hover:text-purple-600"/>
                <MinusIcon aria-hidden="true" stroke="violet"className="h-5 w-5 group-data-[open]:hidden hover:text-purple-600"/>
              </span>
            </DisclosureButton>
          </h3>
          <DisclosurePanel className="pt-6">
            <div className="space-y-6">
              {section.options.map((option, optionIdx) => (
                <div key={option.value} className="flex items-center">
                  <input
                    defaultValue={option.value}
                    defaultChecked={option.checked}
                    id={`filter-mobile-${section.id}-${optionIdx}`}
                    name={`${section.id}[]`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label
                    htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                    className="ml-3 min-w-0 flex-1 text-gray-500"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </DisclosurePanel>
        </Disclosure>
      ))}
    </form>
  </DialogPanel>
</div>
</Dialog>
    )
}

export default MobileDialog 