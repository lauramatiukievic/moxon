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

  const currentQuantityInBag =
    shoppingBag.find(
      (item) => item.id === product.id && item.selectedSize === selectedSize
    )?.quantity || 0;

  const isAtStockLimit = stockQuantity !== null && currentQuantityInBag >= stockQuantity;
  const isOutOfStock = stockQuantity === 0;

  const validateSelections = () => {
    let isValid = true;
  
    // Validate size selection
    if (!selectedSize) {
      setSizeValidation('Reikia pasirinkti dydį, kad galėtumėte pridėti į krepšelį.');
      isValid = false;
    } else {
      setSizeValidation(null); // Clear validation message if size is valid
    }
  
    // Validate color selection (only if color attributes exist)
    const hasColorAttributes = product.attributes?.nodes?.some(
      (attr: ProductAttribute) => attr.name === 'pa_color'
    );
  
    if (hasColorAttributes && !selectedColor) {
      setColorValidation('Reikia pasirinkti spalvą, kad galėtumėte pridėti į krepšelį.');
      isValid = false;
    } else {
      setColorValidation(null); // Clear validation message if color is valid
    }
  
    return isValid;
  };
  
  

  const handleAddToBag = () => {

    if (!validateSelections()) {
      return;
    }
    if (!selectedPrice) {
      console.error("Price not selected");
      return;
    }

    if (!selectedSize) {
      console.error("Size not selected");
      return;
    }
    
    const colorAttributes = product.attributes?.nodes?.filter(
        (attr: ProductAttribute) => attr.name === 'pa_color'
      );

    console.log('Has color attributes')

    if (colorAttributes && colorAttributes.length > 0 && !selectedColor) {
      console.error("Color not selected");
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
      selectedColor: selectedColor || null,
      price: selectedPrice,
      quantity: 1,
      savedVariation: savedVariation || 0,
      stockQuantity: stockQuantity || 0,
      variationId: savedVariation || 0
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
