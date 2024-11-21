'use client';

import { VariableProduct } from '@/gql/graphql';
import { BagItem, useShoppingBag } from "./shoppingBagContext";

interface Props {
  product: VariableProduct;
  selectedPrice: string | null;
  stockQuantity: number | null;
  selectedSize: string | null;
}

export const ProductButtons = ({ product, selectedPrice, stockQuantity, selectedSize }: Props) => {
  const { addToBag, shoppingBag } = useShoppingBag();
  console.log("Selected Size in ProductButtons:", selectedSize);

  const currentQuantityInBag =
    shoppingBag.find(
      (item) => item.id === product.id && item.selectedSize === selectedSize
    )?.quantity || 0;

  const isAtStockLimit = stockQuantity !== null && currentQuantityInBag >= stockQuantity;
  const isOutOfStock = stockQuantity === 0;

  const handleAddToBag = () => {
    if (!selectedPrice) {
      console.error("Price not selected");
      return;
    }

    if (!selectedSize) {
      console.error("Size not selected");
      return;
    }

    if (stockQuantity !== null && stockQuantity <= 0) {
      console.error("Item is out of stock");
      return;
    }

    if (stockQuantity !== null && currentQuantityInBag >= stockQuantity) {
      console.error("No more stock available for this product");
      return;
    }

    const newItem: BagItem = {
      ...product,
      selectedSize,
      price: selectedPrice,
      quantity: 1,
      stockQuantity: stockQuantity || 0,
    };

    console.log("Adding to bag:", newItem); // Debugging
    addToBag(newItem);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleAddToBag}
        disabled={isAtStockLimit || isOutOfStock}
        className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
      >
        Pridėti į krepšelį
      </button>
      {stockQuantity !== null && isOutOfStock ? (
        <p className="mt-2 text-sm text-red-500">Atsiprašome šiuo metu prekės sandelyje nėra.</p>
      ) : isAtStockLimit ? (
        <p className="mt-2 text-sm text-red-500">Jūs pridėjote paskutę prekę esančia sandelyje</p>
      ) : null}
    </div>
  );
};
