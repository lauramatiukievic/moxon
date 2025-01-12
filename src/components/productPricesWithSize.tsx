'use client'
import { useState } from 'react';
import { ProductAttribute, ProductVariation, VariableProduct, Node } from '@/gql/graphql';

interface Props {
  product: VariableProduct;
  onPriceSelect: (price: string | null) => void;
  onStockSelect: (stock: number | null) => void; // New prop for stock
  selectedPrice: string | null;
  onSizeSelect: (size: string | null) => void; 
  onSaveVariation: (variaion: number | null) => void;
  onSelectedColor:  (size: string | null) => void;
}

export const getColorFromSlug = (slug: string) => {
  const colorMap: Record<string, string> = {
    balta: '#ffffff',
    juoda: '#000000',
    melyna: '#0000ff',
    raudona: '#ff0000',
    rozine: '#ffc0cb',
    ruda: '#7B3F00',
    violetine:'#7F00FF',
    zalia:'#008000'
  };

  return colorMap[slug] || '#cccccc'; // Default fallback color
};

export default function SizePriceSelector({ product, onPriceSelect, onStockSelect, selectedPrice, onSizeSelect, onSaveVariation, onSelectedColor}: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);


  const handleSizeSelect = (size: string | null, color: string | null) => {
    setSelectedSize(size);
    setSelectedColor(color);
    console.log("Selected Size:", size); // Debugging
    onSizeSelect(size); 
    onSelectedColor(color)
    // Find the price and stock for the selected size
    if (product.variations?.edges) {
      const selectedVariation = product.variations.edges.find((edge) => {
        const variation = edge.node as ProductVariation;

        // Check if this variation matches the selected size
        return variation.attributes?.nodes?.some((attr: Node) => {
          // const castedAttr = attr as ProductAttribute;
          return (attr as any).name === 'pa_size' && (attr as any).value === size;
       
        });
      });

      if (selectedVariation) {
        const variationNode = selectedVariation.node as ProductVariation;
        const price = variationNode.price || null;
        const stockQuantity = variationNode.stockQuantity || null;
        const variationId = variationNode.databaseId
        console.log("Selected Price:", price, "Selected Stock:", stockQuantity); // Debugging

        // Set price and stock for the selected size
        // save variationId (variationNode.databaseId)
        onPriceSelect(price);
        onStockSelect(stockQuantity);
        onSaveVariation(variationId)
        onSelectedColor(color)
      } else {
        console.log("No matching variation found"); // Debugging
        onPriceSelect(null);  // Clear the price if no variation is found
        onStockSelect(null);  // Clear the stock if no variation is found
        onSaveVariation(null)
      }
    }
  };

  

  const sizeAttributes = product.attributes?.nodes?.filter(
    (attr: ProductAttribute) => attr.name === 'pa_size'
  );

  const colorAttributes = product.attributes?.nodes?.filter(
    (attr: ProductAttribute) => attr.name === 'pa_color'
  );




  return (
    <div>
    <div className='flex flex-row justify-between'>
      <div>
      <h3 className="text-lg font-semibold mb-2 mt-3">Pasirinkite dydį:</h3>
      <div className="flex space-x-2">
        {sizeAttributes && sizeAttributes.length > 0 ? (
          sizeAttributes.map((sizeAttr: ProductAttribute) => {
            if (!sizeAttr.options) return null;

            return sizeAttr.options.map((optionValue) => (
              <button
                key={optionValue}
                type="button"
                onClick={() => handleSizeSelect(optionValue, selectedColor)}
                className={`px-4 py-2 rounded-md border ${
                  selectedSize === optionValue ? 'bg-purple-500 text-white' : 'bg-white text-gray-700'
                } hover:bg-purple-400 hover:text-white transition`}
              >
                {optionValue} ml.
              </button>
            ));
          })
        ) : (
          <p>Šis produktas neturi dydžio</p>
        )}
      </div>
      </div>
      <div>
      <h3 className="text-lg font-semibold mb-2 mt-4">Pasirinkite spalvą:</h3>
      <div className="flex space-x-2">
  {colorAttributes && colorAttributes.length > 0 ? (
    colorAttributes.map((colorAttr: ProductAttribute) => {
      if (!colorAttr.options) return null;

      return colorAttr.options.map((colorSlug) => (
        <button
          key={colorSlug}
          type="button"
          onClick={() => handleSizeSelect(selectedSize, colorSlug)}
          className={`w-8 h-8 rounded-full border-2 ${
            selectedColor === colorSlug
              ? 'ring-2 ring-purple-500 border-purple-500'
              : 'border-gray-300'
          }`}
          // Use Tailwind's `bg-[colorSlug]` class to dynamically apply background colors
          style={{
            backgroundColor: colorSlug ? getColorFromSlug(colorSlug) : '#cccccc', // Helper function to resolve the slug to a color
          }}
        >
          <span className="sr-only">{colorSlug}</span>
        </button>
      ));
    })
  ) : (
    <p>Šis produktas neturi spalvos</p>
  )}
</div>
</div>
      {/* Display selected price */}
    
    </div>
      <p className="mt-5 text-xl font-medium text-gray-900">
      {selectedPrice ? `${selectedPrice} €` : 'Pasirinkite dydį, kad matytumėte kainą'}
    </p>
    </div>

  );
}
