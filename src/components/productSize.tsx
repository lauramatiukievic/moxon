'use client';

import { ProductAttribute, VariableProduct } from '@/gql/graphql';
import { useState } from 'react';
import { ProductAttributes } from '@/utils/common-types';

interface Props {
  product: VariableProduct;
  onSizeSelect: (size: string) => void;  // New callback to notify the parent about the selected size
}

export default function ProductSizes({ product, onSizeSelect }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    onSizeSelect(size);  // Call the callback with the selected size
  };

  const attributes = product.attributes?.nodes as ProductAttribute[];

  const sizeAttribute = attributes?.find(attribute => attribute.name === ProductAttributes.SIZE);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 mt-3">Pasirinkite dydį</h3>
      <div className="flex space-x-2">
        {sizeAttribute && sizeAttribute.options && sizeAttribute.options.length > 0 ? (
          sizeAttribute.options.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => handleSizeSelect(size as string)}
              className={`px-4 py-2 rounded-md border ${
                selectedSize === size ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'
              } hover:bg-purple-500 hover:text-white transition`}
            >
              {size} ml.
            </button>
          ))
        ) : (
          <p>Šis produktas neturi dydžio</p>
        )}
      </div>
      {selectedSize && (
        <p className="mt-2 text-gray-600">Pasirinktas dydis: {selectedSize}</p>
      )}
    </div>
  );
}
