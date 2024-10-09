"use client";

import { SimpleProduct } from '@/gql/graphql';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ShoppingBagContextProps {
  shoppingBag: SimpleProduct[];
  addToBag: (product: SimpleProduct) => void;
  removeFromBag: (id: string) => void;
}

const ShoppingBagContext = createContext<ShoppingBagContextProps | undefined>(undefined);

export const ShoppingBagProvider = ({ children }: { children: ReactNode }) => {
  const [shoppingBag, setShoppingBag] = useState<SimpleProduct[]>([]);

  useEffect(() => {
    const storedBag = localStorage.getItem('shoppingBag');
    if (storedBag) {
      setShoppingBag(JSON.parse(storedBag));
    }
  }, []);

  const removeFromBag = (id: string) => {
    setShoppingBag((prevItems) =>
       prevItems.filter((product) => product.id !== id));
    return 
  };

  const addToBag = (product: SimpleProduct) => {
    setShoppingBag((prevItems) => {
      const updatedBag = [...prevItems, product];
      localStorage.setItem('shoppingBag', JSON.stringify(updatedBag));
      return updatedBag;
    });
  };

  return (
    <ShoppingBagContext.Provider value={{ shoppingBag, addToBag, removeFromBag }}>
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


