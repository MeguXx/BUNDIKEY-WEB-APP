import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CatalogItem } from '../domain/types';
import { initialCatalog } from '../constants/catalog';

// ==========================================
// CatalogContext — idéntico en responsabilidad a CatalogContext.tsx del APK.
// Mantiene el catálogo y expone updatePrice() para la vista de inventario.
// ==========================================

type CatalogContextValue = {
  products: CatalogItem[];
  updatePrice: (id: number, price: number) => void;
};

const CatalogContext = createContext<CatalogContextValue | undefined>(undefined);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<CatalogItem[]>(initialCatalog);

  const updatePrice = (id: number, price: number) => {
    setProducts((current) => current.map((item) => (item.id === id ? { ...item, price } : item)));
  };

  const value = useMemo(() => ({ products, updatePrice }), [products]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog debe usarse dentro de un CatalogProvider');
  return context;
}
