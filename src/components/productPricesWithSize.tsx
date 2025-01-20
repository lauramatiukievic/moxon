'use client'
import { useEffect, useState } from 'react';
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
  
    console.log("Selected Size:", size, "Selected Color:", color); // Debugging
    onSizeSelect(size);
    onSelectedColor(color);
  
    // Find the price and stock for the selected size or color
    if (product.variations?.edges) {
      const selectedVariation = product.variations.edges.find((edge) => {
        const variation = edge.node as ProductVariation;
  
        // Check if this variation matches the selected size and/or color
        const matchesSize = size
          ? variation.attributes?.nodes?.some(
              (attr: Node) => (attr as any).name === "pa_size" && (attr as any).value === size
            )
          : true; // If size is not required, consider it a match
  
        const matchesColor = color
          ? variation.attributes?.nodes?.some(
              (attr: Node) => (attr as any).name === "pa_color" && (attr as any).value === color
            )
          : true; // If color is not required, consider it a match
  
        return matchesSize && matchesColor;
      });



      if (selectedVariation) {
        const variationNode = selectedVariation.node as ProductVariation;
        const price = variationNode.price || null;
        const stockQuantity = variationNode.stockQuantity || null;
        const variationId = variationNode.databaseId;
  
        console.log("Selected Price:", price, "Selected Stock:", stockQuantity); // Debugging
  
        onPriceSelect(price);
        onStockSelect(stockQuantity);
        onSaveVariation(variationId);
      } else {
        console.log("No matching variation found"); // Debugging
        onPriceSelect(null); // Clear the price if no variation is found
        onStockSelect(null); // Clear the stock if no variation is found
        onSaveVariation(null);
      }
    }
  };
  

  

  const sizeAttributes = product.attributes?.nodes?.filter(
    (attr: ProductAttribute) => attr.name === 'pa_size'
  );

  const colorAttributes = product.attributes?.nodes?.filter(
    (attr: ProductAttribute) => attr.name === 'pa_color'
  );

  const hasSizeAttributes = product.attributes?.nodes?.some(
    (attr: ProductAttribute) => attr.name === 'pa_size'
  );

  const sizeOptions = sizeAttributes?.[0]?.options || [];
  const colorOptions = colorAttributes?.[0]?.options || [];


  useEffect(() => {
    let autoSelectedSize = selectedSize;
    let autoSelectedColor = selectedColor;

    // Auto-select size if there's only one option
    if (sizeOptions.length === 1) {
      autoSelectedSize = sizeOptions[0];
      setSelectedSize(autoSelectedSize);
      onSizeSelect(autoSelectedSize); // Notify parent about auto-selected size
    }

    // Auto-select color if there's only one option
    if (colorOptions.length === 1) {
      autoSelectedColor = colorOptions[0];
      setSelectedColor(autoSelectedColor);
      onSelectedColor(autoSelectedColor); // Notify parent about auto-selected color
    }

    // Fetch stock and price based on the auto-selected size and/or color
    if (product.variations?.edges) {
      const selectedVariation = product.variations.edges.find((edge) => {
        const variation = edge.node as ProductVariation;

        // Check if variation matches the auto-selected size
        const matchesSize = autoSelectedSize
          ? variation.attributes?.nodes?.some(
              (attr: Node) =>
                (attr as any).name === "pa_size" &&
                (attr as any).value === autoSelectedSize
            )
          : true; // If size is not required, consider it a match

        // Check if variation matches the auto-selected color
        const matchesColor = autoSelectedColor
          ? variation.attributes?.nodes?.some(
              (attr: Node) =>
                (attr as any).name === "pa_color" &&
                (attr as any).value === autoSelectedColor
            )
          : true; // If color is not required, consider it a match

        return matchesSize && matchesColor;
      });

      if (selectedVariation) {
        const variationNode = selectedVariation.node as ProductVariation;
        const price = variationNode.price || null;
        const stockQuantity = variationNode.stockQuantity || null;
        const variationId = variationNode.databaseId;

        // Update price, stock, and variation
        onPriceSelect(price); // Notify parent about the price
        onStockSelect(stockQuantity); // Notify parent about the stock quantity
        onSaveVariation(variationId); // Notify parent about the variation ID
      }
    }
  }, [
    sizeOptions, // Runs when size options change
    colorOptions, // Runs when color options change
    selectedSize, // Runs when the selected size changes
    selectedColor, // Runs when the selected color changes
    onPriceSelect, // Ensures callback is up-to-date
    onStockSelect, // Ensures callback is up-to-date
    onSaveVariation, // Ensures callback is up-to-date
    onSizeSelect, // Ensures callback is up-to-date
    onSelectedColor, // Ensures callback is up-to-date
    product.variations?.edges, // Runs when product variations change
  ]);



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
      <div className="flex space-x-2">
  {colorAttributes && colorAttributes.length > 0 ? (
    colorAttributes.map((colorAttr: ProductAttribute) => {
      if (!colorAttr.options) return null;

      return colorAttr.options.map((colorSlug) => (
        <button
          key={colorSlug}
          type="button"
          onClick={() => handleSizeSelect(selectedSize, colorSlug)} // Pass the selected color
          className={`w-8 h-8 rounded-full border-2 ${
            selectedColor === colorSlug
              ? "ring-2 ring-purple-500 border-purple-500"
              : "border-gray-300"
          }`}
          style={{
            backgroundColor: colorSlug ? getColorFromSlug(colorSlug) : '#cccccc',
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
      {/* Display selected price */}
    
    </div>
    <p className="mt-5 text-xl font-medium text-gray-900">
  {hasSizeAttributes
    ? selectedPrice 
      ? `${selectedPrice} €` 
      : 'Pasirinkite dydį, kad matytumėte kainą'
    : `${product.price} €`}
</p>
    </div>

  );
}
