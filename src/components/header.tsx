"use client"
import { MagnifyingGlassIcon, ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import Image from 'next/image';
import { useShoppingBag } from '@/components/shoppingBagContext'
import logo from '@/app/images/IMG_2019.jpeg'
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { getColorFromSlug } from './productPricesWithSize';


const navigation = [
  { name: 'Pradžia', href: '#' },
  { name: 'Produktai', href: '/products' },
  { name: 'Pirkėjo informacija', href: '#' },
  { name: 'Kontaktai', href: '#' },
];

export default function Header() {
  const { shoppingBag } = useShoppingBag();
  const { data: session, status } = useSession()

  const [isSessionLoaded, setSessionLoaded] = useState(false);

  useEffect(() => {
    if (status !== 'loading') {
      setSessionLoaded(true);
    }
  }, [status]);

  if (!isSessionLoaded || status === 'loading') {
    return <div>Loading...</div>; // Or a loading spinner
  }

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
              <div className="flex  space-x-8">
                <div className="hidden lg:flex">
                  <a href="#" className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
                  </a>
                </div>

                <div className="flex">
                  {status === 'authenticated' ?
                    (<>
                      <button onClick={() => signOut({ redirectTo: '/products' })} className="flex row-auto -m-2 p-2 text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Account</span>
                        <UserIcon aria-hidden="true" className="size-6" />
                        <span className='pl-2'>Atsijungti</span>
                      </button></>)
                    : (<>
                      <Link href={'/signIn'} className="flex row-auto -m-2 p-2 text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Account</span>
                        <UserIcon aria-hidden="true" className="size-6" />
                        <span className='pl-2'>Prisijungti</span>
                      </Link>
                    </>)
                  }

                </div>
              </div>

              <span aria-hidden="true" className="mx-4 h-6 w-px bg-gray-200 lg:mx-6" />


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
                          <li key={product.id} className="flex items-center py-6">
                            <Image
                              alt={product.image?.altText!}
                              src={product.image?.sourceUrl!}
                              className="h-16 w-16 flex-none rounded-md border border-gray-200"
                              width={38}
                              height={38}
                            />
                            <div className="ml-4 flex-auto">
                              <div className='flex row-auto justify-between '>
                              <h3 className="font-medium text-gray-900 text-base">{product.name}</h3>
                              <p className="text-gray-500">{product.price} €</p>
                              </div>
                           
                              <p className="text-gray-500">Kiekis: {product.quantity ?? 1}</p> {/* Display quantity */}

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
                      <Link href="/payment">
                        <button className="w-full bg-indigo-600 text-white py-2 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none text-center block">
                          Apmokėti
                        </button>
                      </Link>
                    )}
                    <p className="mt-6 text-center">
                      <a href="/checkout" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        Peržiūrėti krepšelį
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
