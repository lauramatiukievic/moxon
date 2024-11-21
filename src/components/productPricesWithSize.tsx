'use client'
import { useState } from 'react';
import { ProductAttribute, ProductVariation, VariableProduct, Node } from '@/gql/graphql';

interface Props {
  product: VariableProduct;
  onPriceSelect: (price: string | null) => void;
  onStockSelect: (stock: number | null) => void; // New prop for stock
  selectedPrice: string | null;
  onSizeSelect: (size: string | null) => void; 
}

export default function SizePriceSelector({ product, onPriceSelect, onStockSelect, selectedPrice, onSizeSelect, }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleSizeSelect = (size: string | null) => {
    setSelectedSize(size);
    console.log("Selected Size:", size); // Debugging
    onSizeSelect(size); 
    // Find the price and stock for the selected size
    if (product.variations?.edges) {
      const selectedVariation = product.variations.edges.find((edge) => {
        const variation = edge.node as ProductVariation;

        // Check if this variation matches the selected size
        return variation.attributes?.nodes?.some((attr: Node) => {
          const castedAttr = attr as ProductAttribute;
          return (attr as any).name === 'pa_size' && (attr as any).value === size;
          // return (castedAttr.name === 'pa_size' && castedAttr.(attr as any).value === size);
        });
      });

      if (selectedVariation) {
        const variationNode = selectedVariation.node as ProductVariation;
        const price = variationNode.price || null;
        const stockQuantity = variationNode.stockQuantity || null;
        console.log("Selected Price:", price, "Selected Stock:", stockQuantity); // Debugging

        // Set price and stock for the selected size
        onPriceSelect(price);
        onStockSelect(stockQuantity);
      } else {
        console.log("No matching variation found"); // Debugging
        onPriceSelect(null);  // Clear the price if no variation is found
        onStockSelect(null);  // Clear the stock if no variation is found
      }
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 mt-3">Pasirinkite dydį</h3>
      <div className="flex space-x-2">
        {product.attributes?.nodes && product.attributes.nodes.length > 0 ? (
          product.attributes.nodes.map((sizeAttr: ProductAttribute) => {
            if (!sizeAttr.options) return null;

            return sizeAttr.options.map((optionValue) => (
              <button
                key={optionValue}
                type="button"
                onClick={() => handleSizeSelect(optionValue)}
                className={`px-4 py-2 rounded-md border ${
                  selectedSize === optionValue ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
                } hover:bg-indigo-500 hover:text-white transition`}
              >
                {optionValue} ml.
              </button>
            ));
          })
        ) : (
          <p>Šis produktas neturi dydžio</p>
        )}
      </div>

      {/* Display selected price */}
      <p className="mt-4 text-3xl font-medium text-gray-900">
        {selectedPrice ? `${selectedPrice} €` : 'Pasirinkite dydį, kad matytumėte kainą'}
      </p>
    </div>
  );
}
