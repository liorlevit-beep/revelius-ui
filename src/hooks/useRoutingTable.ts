import { useState, useEffect, useMemo } from 'react';
import { ProductsAPI } from '../api';
import type { RoutingTable } from '../types/products';

interface RoutingTableCache {
  data: RoutingTable | null;
  loading: boolean;
  error: string | null;
}

interface UseRoutingTableResult {
  data: RoutingTable | null;
  loading: boolean;
  error: string | null;
  providers: string[];
  defaultPsp: string | null;
  mapping: Record<string, string[]>;
  isLoading: boolean;
  refetch: () => void;
}

// Fallback providers when API fails
const FALLBACK_PROVIDERS = ['stripe', 'adyen', 'rapyd'];

let cachedData: RoutingTable | null = null;
let cachedError: string | null = null;
let isFetching = false;
let listeners: Array<(cache: RoutingTableCache) => void> = [];

/**
 * Hook to fetch and cache the routing table
 * Implements singleton fetch pattern to avoid duplicate API calls
 */
export function useRoutingTable(): UseRoutingTableResult {
  const [state, setState] = useState<RoutingTableCache>({
    data: cachedData,
    loading: !cachedData && !cachedError,
    error: cachedError,
  });

  const fetchRoutingTable = async () => {
    if (isFetching) return;

    isFetching = true;
    
    try {
      const response = await ProductsAPI.getRoutingTable();
      const data = response?.data ?? response;
      
      cachedData = data as RoutingTable;
      cachedError = null;
      
      // Notify all listeners
      const newState: RoutingTableCache = {
        data: cachedData,
        loading: false,
        error: null,
      };
      listeners.forEach(listener => listener(newState));
    } catch (err: any) {
      cachedError = err.message || 'Failed to load routing table';
      cachedData = null;
      
      // Notify all listeners
      const newState: RoutingTableCache = {
        data: null,
        loading: false,
        error: cachedError,
      };
      listeners.forEach(listener => listener(newState));
    } finally {
      isFetching = false;
    }
  };

  useEffect(() => {
    // Add this component to listeners
    listeners.push(setState);

    // If we already have data or error, nothing to fetch
    if (cachedData || cachedError) {
      return () => {
        listeners = listeners.filter(l => l !== setState);
      };
    }

    // If already fetching, just wait for the result
    if (isFetching) {
      return () => {
        listeners = listeners.filter(l => l !== setState);
      };
    }

    // Start fetching
    fetchRoutingTable();

    return () => {
      listeners = listeners.filter(l => l !== setState);
    };
  }, []);

  // Compute derived properties
  const derived = useMemo(() => {
    const mapping = state.data?.provider_category_mapping || {};
    const providers = Object.keys(mapping);
    const defaultPsp = state.data?.default_psp || null;

    // If we have an error, use fallback providers
    const finalProviders = state.error && providers.length === 0 ? FALLBACK_PROVIDERS : providers;

    return {
      providers: finalProviders,
      defaultPsp: state.error && !defaultPsp ? FALLBACK_PROVIDERS[0] : defaultPsp,
      mapping,
    };
  }, [state.data, state.error]);

  const refetch = () => {
    cachedData = null;
    cachedError = null;
    setState({ data: null, loading: true, error: null });
    fetchRoutingTable();
  };

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    providers: derived.providers,
    defaultPsp: derived.defaultPsp,
    mapping: derived.mapping,
    isLoading: state.loading,
    refetch,
  };
}

/**
 * Clear the cached routing table (useful for testing or refresh)
 */
export function clearRoutingTableCache() {
  cachedData = null;
  cachedError = null;
  isFetching = false;
}
