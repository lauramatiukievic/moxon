import React, { useState, useEffect, SyntheticEvent } from "react";

interface ColorFilterProps {
  products: any[];
  onFilterChange: (filteredColors: string[]) => void;
}

const ColorFilter: React.FC<ColorFilterProps> = ({ products, onFilterChange }) => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [colorOptions, setColorOptions] = useState<string[]>([]);

  // Extract unique color options from all products
  useEffect(() => {
    const uniqueColors = Array.from(
      new Set(
        products.flatMap((product) =>
          product.attributes?.nodes
            ?.filter((attr: any) => attr.name === "pa_color") // Filter by color attribute
            .flatMap((attr: any) => attr.options || [])
        )
      )
    );
    setColorOptions(uniqueColors);
  }, [products]);

  // Handle color selection
  const handleColorChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value, checked } = e.currentTarget;

    setSelectedColors((prevColors) => {
      const updatedColors = checked
        ? [...prevColors, value]
        : prevColors.filter((color) => color !== value);

      // Notify parent component about the selected filters
      onFilterChange(updatedColors);
      return updatedColors;
    });
  };

  return (
    <div className="border-b border-gray-200 py-6">
      <h3 className="-my-3 flow-root">
        <button
          type="button"
          className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
        >
          <span className="font-medium text-gray-900">Spalva</span>
          <span className="ml-6 flex items-center">
            <svg
              className="h-5 w-5 group-data-[open]:hidden"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <svg
              className="h-5 w-5 [.group:not([data-open])_&]:hidden"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
            </svg>
          </span>
        </button>
      </h3>

      {/* Color Options */}
      <div className="pt-6">
        <div className="space-y-4">
          {colorOptions.length > 0 ? (
            colorOptions.map((color) => (
              <div key={color} className="flex items-center">
                <input
                  id={`color-${color}`}
                  name="color[]"
                  type="checkbox"
                  value={color}
                  checked={selectedColors.includes(color)}
                  onChange={handleColorChange}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor={`color-${color}`} className="ml-3 text-sm text-gray-600">
                  {color}
                </label>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No colors available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorFilter;
