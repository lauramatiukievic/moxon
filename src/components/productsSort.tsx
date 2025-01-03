'use client';

import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const sortOptions = [
  { name: 'Kaina: nuo min iki max', sortKey: 'asc' },
  { name: 'Kaina: nuo max iki min', sortKey: 'desc' },
];

interface Props {
  onSortChange: (sortOrder: string) => void;
}

const ProductsSort = ({ onSortChange }: Props) => {
  const [currentSort, setCurrentSort] = useState<string>('asc');

  const handleSortChange = (sortKey: string) => {
    setCurrentSort(sortKey);
    onSortChange(sortKey);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
          Rušiavimas
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
          />
        </MenuButton>
      </div>

      <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          {sortOptions.map((option) => (
            <MenuItem key={option.sortKey}>
              <button
                onClick={() => handleSortChange(option.sortKey)}
                className={classNames(
                  currentSort === option.sortKey ? 'font-medium text-gray-900' : 'text-gray-500',
                  'block px-4 py-2 text-sm hover:bg-gray-100'
                )}
              >
                {option.name}
              </button>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
};

export default ProductsSort;
