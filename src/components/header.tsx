"use client"
// Header.tsx
import { MagnifyingGlassIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import Image from 'next/image';
import { useShoppingBag } from '@/components/shoppingBagContext'
import logo from '@/app/images/IMG_2019.jpeg'
import Link from 'next/link';

const navigation = [
  { name: 'Pradžia', href: '#' },
  { name: 'Produktai', href: '/products' },
  { name: 'Pirkėjo informacija', href: '#' },
  { name: 'Kontaktai', href: '#' },
];

export default function Header() {
  const { shoppingBag } = useShoppingBag();

  return (
    <header className="relative bg-white">
      <nav aria-label="Top" className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative border-b border-gray-200 px-4 pb-14 sm:static sm:px-0 sm:pb-0">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex flex-1">
              <a href="#">
                <span className="sr-only">Your Company</span>
                <Image
                  alt="Your Company Logo"
                  src={logo}
                  width={48} 
                  height={48} 
                  priority
                />
              </a>
            </div>

            <div className="absolute inset-x-0 bottom-0 overflow-x-auto border-t sm:static sm:border-t-0">
              <div className="flex h-14 items-center space-x-8 px-4 sm:h-auto">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href} className="text-sm font-medium text-gray-700 hover:text-gray-800">
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-1 items-center justify-end">
              {/* Search */}
              <a href="#" className="p-2 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Search</span>
                <MagnifyingGlassIcon aria-hidden="true" className="h-6 w-6" />
              </a>

              {/* Cart */}
              <Popover className="ml-4 flow-root text-sm lg:relative lg:ml-8">
                <PopoverButton className="group -m-2 flex items-center p-2">
                  <ShoppingBagIcon
                    aria-hidden="true"
                    className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                    {shoppingBag.length} {/* Display the number of items in the bag */}
                  </span>
                  <span className="sr-only">items in cart, view bag</span>
                </PopoverButton>
                <PopoverPanel
                  transition
                  className="absolute inset-x-0 z-50 top-16 mt-px bg-white pb-6 shadow-lg transition data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in sm:px-2 lg:left-auto lg:right-0 lg:top-full lg:-mr-1.5 lg:mt-3 lg:w-80 lg:rounded-lg lg:ring-1 lg:ring-black lg:ring-opacity-5"
                >
                  <h2 className="sr-only">Shopping Cart</h2>

                  <form className="mx-auto max-w-2xl px-4">
                    <ul role="list" className="divide-y divide-gray-200">
                      {shoppingBag.length === 0 ? (
                        <p className="text-center text-gray-500 py-6">Your shopping bag is empty.</p>
                      ) : (
                        shoppingBag.map((product) => (
                          <li key={product.id} className="flex items-center py-6">
                            <Image
                              alt={product.imageAlt}
                              src={product.imageSrc}
                              className="h-16 w-16 flex-none rounded-md border border-gray-200"
                              width={38}
                              height={38}
                            />
                            <div className="ml-4 flex-auto">
                              <h3 className="font-medium text-gray-900">{product.name}</h3>
                              <p className="text-gray-500">{product.price}</p>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>

                    {shoppingBag.length > 0 && (
                      <button
                        type="submit"
                        className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                      >
                        Checkout
                      </button>
                    )}
                    <p className="mt-6 text-center">
                      <a href="/checkout" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        View Shopping Bag
                      </a>
                    </p>
                  </form>
                </PopoverPanel>
              </Popover>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}