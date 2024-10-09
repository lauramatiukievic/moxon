"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface MobileContextProps {
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (open: boolean) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
}

const MobileContext = createContext<MobileContextProps | undefined>(undefined);

export const MobileProvider = ({ children }: { children: ReactNode }) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');

  return (
    <MobileContext.Provider value={{ mobileFiltersOpen, setMobileFiltersOpen, sortOrder, setSortOrder }}>
      {children}
    </MobileContext.Provider>
  );
};

export const useMobileContext = () => {
  const context = useContext(MobileContext);
  if (!context) {
    throw new Error('useMobileContext must be used within a MobileProvider');
  }
  return context;
};
