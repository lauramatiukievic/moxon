'use client';

import { ProductAttribute, VariableProduct } from '@/gql/graphql';
import { BagItem, useShoppingBag } from "./shoppingBagContext";
import { useState } from 'react';

interface Props {
  product: VariableProduct;
  selectedPrice: string | null;
  stockQuantity: number | null;
  selectedSize: string | null;
  savedVariation: number | null;
  selectedColor: string | null 
}

export const ProductButtons = ({ product, selectedPrice, stockQuantity, selectedSize, savedVariation, selectedColor }: Props) => {
  const { addToBag, shoppingBag } = useShoppingBag();

  const [sizeValidation, setSizeValidation] = useState<string | null>(null);
const [colorValidation, setColorValidation] = useState<string | null>(null);

const sizeOptions =
product.attributes?.nodes
  ?.find((attr: ProductAttribute) => attr.name === "pa_size")
  ?.options ?? [];
const colorOptions =
product.attributes?.nodes
  ?.find((attr: ProductAttribute) => attr.name === "pa_color")
  ?.options ?? [];



const currentQuantityInBag = shoppingBag
  .filter(
    (item) =>
      item.id === product.id &&
      (selectedSize ? item.selectedSize === selectedSize : true) &&
      (selectedColor ? item.selectedColor === selectedColor : true)
  )
  .reduce((total, item) => total + item.quantity, 0);

  const isAtStockLimit = stockQuantity !== null && currentQuantityInBag >= stockQuantity;
  const isOutOfStock = stockQuantity === 0;

  const validateSelections = () => {
    let isValid = true;

    const hasSizeAttributes = product.attributes?.nodes?.some(
      (attr: ProductAttribute) => attr.name === 'pa_size'
    );
  
    // Validate size selection
    if (sizeOptions.length > 1 &&!selectedSize) {
      setSizeValidation('Reikia pasirinkti dydį, kad galėtumėte pridėti į krepšelį.');
      isValid = false;
    } else {
      setSizeValidation(null); // Clear validation message if size is valid
    }
  
    // Validate color selection (only if color attributes exist)
    const hasColorAttributes = product.attributes?.nodes?.some(
      (attr: ProductAttribute) => attr.name === 'pa_color'
    );
  
    if (colorOptions.length > 1 && !selectedColor) {
      setColorValidation('Reikia pasirinkti spalvą, kad galėtumėte pridėti į krepšelį.');
      isValid = false;
    } else {
      setColorValidation(null); // Clear validation message if color is valid
    }
  
    return isValid;
  };
  
  // console.log(stockQuantity)

  const handleAddToBag = () => {
    const hasSizeAttributes = product.attributes?.nodes?.some(
      (attr: ProductAttribute) => attr.name === 'pa_size'
    );
  
    if (!validateSelections()) {
      return;
    }
  
    const newItem: BagItem = {
      ...product,
      // selectedSize: hasSizeAttributes ? selectedSize : null,
      // selectedColor: selectedColor || null,

      selectedSize: sizeOptions.length === 1 ? sizeOptions[0] : selectedSize,
      selectedColor: colorOptions.length === 1 ? colorOptions[0] : selectedColor,

      price: selectedPrice || product.price || "0",
      quantity: 1,
      savedVariation: savedVariation || 0,
      stockQuantity: stockQuantity || 0,
      variationId: savedVariation || 0,
    };
  
    addToBag(newItem);
  };
  

  // console.log(sizeValidation)

  return (
    <div>
      <button
        type="button"
        onClick={handleAddToBag}
        disabled={isAtStockLimit || isOutOfStock}
        className="bg-purple-500 flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
      >
        Pridėti į krepšelį
      </button>
      {sizeValidation && <p className="mt-2 text-sm text-red-500">{sizeValidation}</p>}
      {colorValidation && <p className="mt-2 text-sm text-red-500">{colorValidation}</p>}

      {stockQuantity !== null && isOutOfStock ? (
        <p className="mt-2 text-sm text-red-500">Atsiprašome šiuo metu prekės sandelyje nėra.</p>
      ) : isAtStockLimit ? (
        <p className="mt-2 text-sm text-red-500">Jūs pridėjote paskutę prekę esančia sandelyje</p>
      ) : null}
    </div>
  );
};
