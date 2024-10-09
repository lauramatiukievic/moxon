'use client';

import { SimpleProduct } from '@/gql/graphql';
import { HeartIcon } from "@heroicons/react/24/solid";
import { useShoppingBag } from "./shoppingBagContext";

interface Props {
  product: SimpleProduct;
}

// ProductButtons Component
export const ProductButtons = ({ product }: Props) => {
  const { addToBag } = useShoppingBag();

  const handleAddToBag = () => {
    addToBag(product); // Add the current product to the shopping bag
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleAddToBag}
        className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
      >
        Add to Bag
      </button>
    </div>
  );
};

// FavProduct Component
export const FavProduct = () => {
  return (
    <button
      type="button"
      className="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
    >
      <HeartIcon aria-hidden="true" className="h-6 w-6 flex-shrink-0" />
      <span className="sr-only">Add to favorites</span>
    </button>
  );
};
