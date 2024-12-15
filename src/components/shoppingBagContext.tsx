"use client";

import { VariableProduct } from '@/gql/graphql';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "react-toastify";

export interface BagItem extends VariableProduct {
  quantity: number; 
  stockQuantity?: number; 
  selectedSize: string;
  price: string;
}

interface ShoppingBagContextProps {
  shoppingBag: BagItem[];
  addToBag: (product: BagItem) => void; 
  removeFromBag: (id: string, selectedSize: string) => void; 
  updateQuantity: (id: string, quantity: number, selectedSize: string) => void;
}

const ShoppingBagContext = createContext<ShoppingBagContextProps | undefined>(undefined);

export const ShoppingBagProvider = ({ children }: { children: ReactNode }) => {
  const [shoppingBag, setShoppingBag] = useState<BagItem[]>([]);
  

  useEffect(() => {
    const storedBag = localStorage.getItem('shoppingBag');
    if (storedBag) {
      const parsedBag = JSON.parse(storedBag) as BagItem[];
      // Log to verify stockQuantity is present
      parsedBag.forEach(item => {
        console.log(`Retrieved item ${item.name} with stockQuantity: ${item.stockQuantity}`);
      });
      setShoppingBag(parsedBag);
    }
  }, []);

  const removeFromBag = (id: string, selectedSize: string) => {
    setShoppingBag((prevItems) => {
      const updatedBag = prevItems.filter(
        (product) => !(product.id === id && product.selectedSize === selectedSize)
      );
      localStorage.setItem('shoppingBag', JSON.stringify(updatedBag));
      return updatedBag;
    });
  };
  
  const addToBag = (product: BagItem) => {
    setShoppingBag((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.selectedSize === product.selectedSize
      );
  
      if (existingItemIndex !== -1) {
        const existingItem = prevItems[existingItemIndex];
  
        // Only check stock if stockQuantity is defined
        if (product.stockQuantity !== undefined && existingItem.quantity + 1 > product.stockQuantity) {
          toast.error('No more stock available for this product');
          return prevItems;
        }
  
        const updatedBag = prevItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        localStorage.setItem('shoppingBag', JSON.stringify(updatedBag));
        return updatedBag;
      } else {
        const updatedBag = [...prevItems, product];
        localStorage.setItem('shoppingBag', JSON.stringify(updatedBag));
        return updatedBag;
      }
    });
  };
  
  
  
  const updateQuantity = (id: string, quantity: number, selectedSize: string) => {
    setShoppingBag((prevItems) => {
      const updatedBag = prevItems.map((item) =>
        item.id === id && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      );
      localStorage.setItem("shoppingBag", JSON.stringify(updatedBag));
      return updatedBag;
    });
  };
  
  

  return (
    <ShoppingBagContext.Provider value={{ shoppingBag, addToBag, removeFromBag, updateQuantity }}>
      {children}
    </ShoppingBagContext.Provider>
  );
};

export const useShoppingBag = () => {
  const context = useContext(ShoppingBagContext);
  if (!context) {
    throw new Error('useShoppingBag must be used within a ShoppingBagProvider');
  }
  return context;
};


