'use client'

import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useShoppingBag } from '@/components/shoppingBagContext';
import { useState, useEffect } from 'react';
import { getColorFromSlug } from './productPricesWithSize';
import { Logo } from './logo';

const navigation = [
  { name: 'Produktai', href: '/products' },
  { name: 'Kontaktai', href: '#' },
  { name: 'Apie Mus', href: '#' }
];

export default function Header() {
  const { shoppingBag } = useShoppingBag();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSessionLoaded, setSessionLoaded] = useState(false);

  useEffect(() => {
    if (status !== 'loading') {
      setSessionLoaded(true);
    }
  }, [status]);

  if (!isSessionLoaded || status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <header className="relative border-b border-gray-200 px-4">

      <div className="absolute top-[-100px] left-[-200px] w-[500px] h-[500px] bg-purple-500 blur-[200px] opacity-60 rounded-full -z-10"></div>
      <div className="absolute top-[50px] right-[-150px] w-[400px] h-[400px] bg-purple-500 blur-[150px] opacity-50 rounded-full -z-10"></div>
      <nav aria-label="Top" className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative  sm:static sm:px-0 sm:pb-0">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            {!mobileMenuOpen && (
              <div className="mr-2 hidden lg:flex lg:items-center lg:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            {!mobileMenuOpen && (
              <div className="flex flex-1 items-center justify-end">
                {/* Search */}
                {/* <div className="relative mr-5">
                  <input
                    type="text"
                    placeholder="Paieška"
                    className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 shadow-sm focus:border-purple-500 focus:ring-purples-500 sm:text-sm"
                  />
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                  />
                </div> */}
                <div>
                  {status === 'authenticated' ? (
                    <button
                      onClick={() => signOut()}
                      className="text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      Atsijungti
                    </button>
                  ) : (
                    <Link
                      href="/signIn"
                      className="text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      Prisijungti
                    </Link>
                  )}
                </div>
                {/* <span
                  aria-hidden="true"
                  className="mx-2 h-6 w-px bg-gray-200 lg:mx-6"
                /> */}

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
                    <h2 className="sr-only">Krepšelis</h2>

                    <form className="mx-auto max-w-2xl px-4">
                      <ul role="list" className="divide-y divide-gray-200">
                        {shoppingBag.length === 0 ? (
                          <p className="text-center text-gray-500 py-6">Krepšelis yra tuščias</p>
                        ) : (
                          shoppingBag.map((product) => (
                            <li key={'' + product.savedVariation + product.selectedColor} className="flex items-center py-6">
                              <Image
                                alt={product.image?.altText!}
                                src={product.image?.sourceUrl!}
                                className="h-16 w-16 flex-none rounded-md border border-gray-200"
                                width={38}
                                height={38}
                              />
                              <div className="ml-4 flex-auto">
                              <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-gray-700 font-medium">{product.price} €</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">Kiekis: {product.quantity ?? 1}</p>
                                {/* Show color */}
                                {product.selectedColor && (
                                  <div className="flex items-center space-x-2">
                                    <div
                                      className="w-4 h-4 rounded-full border border-gray-300"
                                      style={{
                                        backgroundColor: getColorFromSlug(product.selectedColor),
                                      }}
                                    ></div>
                                    {/* <p className="text-gray-600 ">
                                    {product.selectedColor.charAt(0).toUpperCase() +
                                      product.selectedColor.slice(1).toLowerCase()}
                                  </p> */}
                                  </div>
                                )}
                              </div>

                            </li>
                          ))
                        )}
                      </ul>

                      {shoppingBag.length > 0 && (
                        <PopoverButton as={Link} href="/checkout">
                          <p className="w-full bg-purple-500 text-white py-2 rounded-md shadow-md hover:bg-purple-500 focus:outline-none text-center block">
                            Apmokėti
                          </p>
                        </PopoverButton>
                      )}
                      <PopoverButton as={Link} href={'/cart'} className="text-sm font-medium text-purple-500 hover:text-purple-300">
                        <p className="mt-6 text-center">
                          Peržiūrėti krepšelį
                        </p>
                      </PopoverButton>
                    </form>
                  </PopoverPanel>
                </Popover>

                <span
                  aria-hidden="true"
                  className="mx-2 h-6 w-px bg-gray-200 lg:mx-6"
                />

              </div>

            )}

            <div className="pl-3 flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-25">
          <div className="absolute top-0 right-0 h-full w-64 bg-white shadow-md">
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <div className="mt-10 space-y-4 px-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-sm font-medium text-gray-700 hover:text-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-4">
                {status === 'authenticated' ? (
                  <button
                    onClick={() => signOut()}
                    className="text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    Atsijungti
                  </button>
                ) : (
                  <Link
                    href="/signIn"
                    className="text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    Prisijungti
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
