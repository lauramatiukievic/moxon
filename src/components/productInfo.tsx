"use client";

import { useState } from 'react';
import { VariableProduct } from '@/gql/graphql';
import { ProductButtons } from '@/components/productButton';
import SizePriceSelector from '@/components/productPricesWithSize';

interface ProductInfoProps {
  product: VariableProduct;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [stockQuantity, setStockQuantity] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [savedVariation, setSavedVariations] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // console.log(product.id)

  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false); // State for toggling description

  const handlePriceSelect = (price: string | null) => setSelectedPrice(price);
  const handleStockSelect = (stock: number | null) => setStockQuantity(stock);
  const handleSizeSelect = (size: string | null) => setSelectedSize(size);
  const handleSaveVariation = (variation: number | null) => setSavedVariations(variation);
  const handleSelectedColor = (color: string | null) => setSelectedColor(color);

  // console.log(stockQuantity)
  const toggleDescription = () => {
    setIsDescriptionVisible(!isDescriptionVisible);
  };

  return (
    <>
    {
      product ? (
        <div>
        <div className="flex flex-row justify-between align-middle">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
        </div>
  
        <div className="mt-2">
          <div
            className="space-y-6 text-base text-gray-700"
            dangerouslySetInnerHTML={{ __html: product.shortDescription || '' }}
          />
        </div>
  
        {/* Size & Price Selector */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900">Parinktys</h2>
          <SizePriceSelector
            product={product}
            onSizeSelect={handleSizeSelect}
            onPriceSelect={handlePriceSelect}
            onStockSelect={handleStockSelect}
            selectedPrice={selectedPrice}
            onSaveVariation={handleSaveVariation}
            onSelectedColor={handleSelectedColor}
          />
        </div>
  
        {/* Add to Cart Button */}
        <form className="mt-6 mb-3 relative border-b border-gray-200 px-4 pb-14 sm:static sm:px-0 sm:pb-3">
          <div className="mt-š flex space-x-4">
            <ProductButtons
              product={product}
              selectedPrice={selectedPrice}
              stockQuantity={stockQuantity}
              selectedSize={selectedSize}
              savedVariation={savedVariation}
              selectedColor={selectedColor}
            />
          </div>
        </form>
  
        {/* Toggleable Description */}
        {product.description && (
    <div className="mt-6 border border-gray-300 rounded-lg p-4">
      <button
        onClick={toggleDescription}
        className="text-lg font-semibold text-gray-900 hover:text-gray-700 w-full text-left"
      >
        {isDescriptionVisible
          ? 'Slėpti produkto aprašymą'
          : 'Peržiūrėti produkto aprašymą'}
      </button>
  
      {isDescriptionVisible && (
        <div
          className="mt-4 border-t border-gray-200 pt-4 text-gray-700"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      )}
    </div>
  )}

  
      </div>
      ) : (
        <></>
      )
    }
    </>
  );
}
