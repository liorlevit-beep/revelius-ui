import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { providers as initialProviders, type Provider } from '../demo/providers';

interface ProvidersContextType {
  providers: Provider[];
  addProvider: (provider: Provider) => void;
  updateProvider: (id: string, updates: Partial<Provider>) => void;
  removeProvider: (id: string) => void;
}

const ProvidersContext = createContext<ProvidersContextType | undefined>(undefined);

export function ProvidersProvider({ children }: { children: ReactNode }) {
  const [providers, setProviders] = useState<Provider[]>(initialProviders);

  const addProvider = (provider: Provider) => {
    setProviders((prev) => [...prev, provider]);
  };

  const updateProvider = (id: string, updates: Partial<Provider>) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const removeProvider = (id: string) => {
    setProviders((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProvidersContext.Provider value={{ providers, addProvider, updateProvider, removeProvider }}>
      {children}
    </ProvidersContext.Provider>
  );
}

export function useProviders() {
  const context = useContext(ProvidersContext);
  if (!context) {
    throw new Error('useProviders must be used within a ProvidersProvider');
  }
  return context;
}


