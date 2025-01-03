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
  const [stockQuantity, setStockQuantity] = useState<number | null>(null); // Track stock quantity
  const [selectedSize, setSelectedSize] = useState<string | null>(null); // Track selected size
  const [savedVariation, setSavedVariations] = useState<number| null> (null)
  const [selectColor, setSelectedColor]=useState<string | null>(null); 

  const handlePriceSelect = (price: string | null) => {
    setSelectedPrice(price);
  };

  const handleStockSelect = (stock: number | null) => {
    setStockQuantity(stock);
  };

  const handleSizeSelect = (size: string | null) => {
    setSelectedSize(size);
  };

  const handleSaveVariation = (varation: number | null)=>{
    setSavedVariations(varation)
  }

  const handleSelectedColor =(color: string | null)=>{
    setSelectedColor(color)
  }


  console.log(product.variations?.edges); // Debugging purposes

  return (
    <div>
      <div className="flex flex-row justify-between align-middle">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
      </div>
      
      <div className="mt-2">
        <div className="space-y-6 text-base text-gray-700" dangerouslySetInnerHTML={{ __html: product.shortDescription || '' }} />
      </div>

      {/* Pass selectedPrice and stockQuantity handlers to SizePriceSelector */}
      <SizePriceSelector 
        product={product} 
        onSizeSelect={handleSizeSelect}
        onPriceSelect={handlePriceSelect} 
        onStockSelect={handleStockSelect} 
        selectedPrice={selectedPrice} 
        onSaveVariation={handleSaveVariation}
        onSelectedColor={handleSelectedColor}
      />

      <form className="mt-6 mb-3 relative border-b border-gray-200 px-4 pb-14 sm:static sm:px-0 sm:pb-3">
        <div className="mt-15 flex">
          <ProductButtons product={product} selectedPrice={selectedPrice} stockQuantity={stockQuantity} selectedSize={selectedSize} savedVariation={savedVariation} selectedColor={selectColor}/>
        </div>
      </form>

      <div>
        <h3 className="text-black">PRODUKTO APRAŠYMAS</h3>
        <p className="mt-2 text-gray-700" dangerouslySetInnerHTML={{ __html: product.description || '' }} />
      </div>
    </div>
  );
}
