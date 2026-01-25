import { useState, useEffect, useMemo } from 'react';
import { Loader2, AlertTriangle, Wallet, Globe, Key, Search, X, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { ApiKeysModal } from '../components/ApiKeysModal';
import { ProviderCard } from '../components/paymentProviders/ProviderCard';
import { ProviderDetailsModal } from '../components/paymentProviders/ProviderDetailsModal';
import { ProductsAPI } from '../api';
import type { Provider, ProviderRegion } from '../types/paymentProviders';
import type { ProductCategory } from '../types/products';
import { getProviderRegions, getProviderDisplayName } from '../data/providerRegions';
import { preloadProviderLogos } from '../utils/providerLogoResolver';

const ALL_REGIONS: ProviderRegion[] = [
  'Global',
  'North America',
  'Europe',
  'United Kingdom',
  'Israel',
  'LATAM',
  'APAC',
  'Africa & Middle East',
];

export function PaymentProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeysModal, setShowApiKeysModal] = useState(false);
  
  // Provider detail modal
  const [selectedProviderKey, setSelectedProviderKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<ProviderRegion[]>([]);
  const [showOnlyDefault, setShowOnlyDefault] = useState(false);
  const [showAllCategoriesOnly, setShowAllCategoriesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'categories' | 'name' | 'region'>('categories');

  // Filtered and sorted providers
  const filteredProviders = useMemo(() => {
    let filtered = providers;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.key.toLowerCase().includes(query)
      );
    }

    // Region filter
    if (selectedRegions.length > 0) {
      filtered = filtered.filter(p =>
        p.regions.some(r => selectedRegions.includes(r))
      );
    }

    // Default filter
    if (showOnlyDefault) {
      filtered = filtered.filter(p => p.isDefault);
    }

    // All Categories filter
    if (showAllCategoriesOnly && totalCategories > 0) {
      filtered = filtered.filter(p => {
        const coverage = p.categoryIds.length / totalCategories;
        return coverage >= 0.98; // 98% or higher counts as "all categories"
      });
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'categories') {
        return b.categoryIds.length - a.categoryIds.length;
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'region') {
        // Sort by first region, then by category count
        const regionA = a.regions[0] || 'Global';
        const regionB = b.regions[0] || 'Global';
        if (regionA !== regionB) {
          return ALL_REGIONS.indexOf(regionA) - ALL_REGIONS.indexOf(regionB);
        }
        return b.categoryIds.length - a.categoryIds.length;
      }
      return 0;
    });

    return filtered;
  }, [providers, searchQuery, selectedRegions, showOnlyDefault, showAllCategoriesOnly, totalCategories, sortBy]);

  // Group providers by primary region
  const groupedProviders = useMemo(() => {
    const groups: Record<ProviderRegion, Provider[]> = {
      'Global': [],
      'North America': [],
      'Europe': [],
      'United Kingdom': [],
      'Israel': [],
      'LATAM': [],
      'APAC': [],
      'Africa & Middle East': [],
    };

    filteredProviders.forEach(provider => {
      // If provider has "Global" in regions, put it in Global
      if (provider.regions.includes('Global')) {
        groups['Global'].push(provider);
      } else {
        // Otherwise, put it in the first region
        const primaryRegion = provider.regions[0] || 'Global';
        groups[primaryRegion].push(provider);
      }
    });

    return groups;
  }, [filteredProviders]);

  // Build selected provider object from selectedProviderKey
  const selectedProvider = useMemo(() => {
    if (!selectedProviderKey) return null;
    return providers.find(p => p.key === selectedProviderKey) || null;
  }, [selectedProviderKey, providers]);

  // Debug: log when providers state changes
  useEffect(() => {
    console.log('[PaymentProviders] State updated - providers:', providers);
    console.log('[PaymentProviders] State updated - providers length:', providers.length);
  }, [providers]);

  useEffect(() => {
    async function fetchProviders() {
      try {
        setLoading(true);
        setError(null);
        
        // Debug: Check what keys are in localStorage
        const storedAccessKey = localStorage.getItem('revelius_access_key');
        const storedSecretKey = localStorage.getItem('revelius_secret_key');
        console.log('[PaymentProviders] === KEYS IN LOCALSTORAGE ===');
        console.log('[PaymentProviders] Access Key (first 20):', storedAccessKey ? storedAccessKey.substring(0, 20) + '...' : 'NOT SET');
        console.log('[PaymentProviders] Secret Key (first 20):', storedSecretKey ? storedSecretKey.substring(0, 20) + '...' : 'NOT SET');
        console.log('[PaymentProviders] Full Access Key length:', storedAccessKey?.length || 0);
        console.log('[PaymentProviders] Full Secret Key length:', storedSecretKey?.length || 0);
        
        let routingResponse;
        let useFallback = false;
        
        // Try to fetch routing table first, with fallback to payment_providers
        try {
          console.log('[PaymentProviders] Attempting to fetch routing table...');
          routingResponse = await ProductsAPI.getRoutingTable();
        } catch (routingError: any) {
          console.warn('[PaymentProviders] Routing table fetch failed, falling back to payment_providers endpoint:', routingError);
          useFallback = true;
          // Fallback: fetch from /products/payment_providers
          routingResponse = await ProductsAPI.getPaymentProviders();
        }
        
        // Fetch categories (always needed)
        const categoriesResponse = await ProductsAPI.getCategories();
        
        // Extract categories
        const categoriesData = categoriesResponse?.data ?? categoriesResponse;
        const categoriesList = Array.isArray(categoriesData) ? categoriesData : [];
        console.log('[PaymentProviders] Categories response:', categoriesResponse);
        console.log('[PaymentProviders] Categories data:', categoriesData);
        console.log('[PaymentProviders] Categories list:', categoriesList);
        console.log('[PaymentProviders] First category sample:', categoriesList[0]);
        setCategories(categoriesList);
        setTotalCategories(categoriesList.length);
        console.log('[PaymentProviders] Total categories:', categoriesList.length);
        
        const response = routingResponse;
        console.log(`[PaymentProviders] Raw API response (from ${useFallback ? 'payment_providers' : 'routing_table'}):`, response);
        console.log('[PaymentProviders] Raw API response (stringified):', JSON.stringify(response, null, 2));
        
        // Extract data
        const data = response?.data ?? response;
        console.log('[PaymentProviders] Extracted data:', data);
        
        const defaultPsp = data?.default_psp ?? '';
        const mapping = data?.mapping ?? {};
        
        console.log('[PaymentProviders] Default PSP:', defaultPsp);
        console.log('[PaymentProviders] Mapping object:', mapping);
        console.log('[PaymentProviders] Mapping keys:', Object.keys(mapping));
        console.log('[PaymentProviders] Number of mapping keys:', Object.keys(mapping).length);
        console.log('[PaymentProviders] Expected 56, got:', Object.keys(mapping).length);
        
        // Transform mapping into Provider array
        const providerList: Provider[] = Object.entries(mapping).map(([key, categoryIds]) => {
          const provider = {
            key,
            name: getProviderDisplayName(key),
            regions: getProviderRegions(key),
            categoryIds: categoryIds as string[],
            isDefault: key === defaultPsp,
          };
          console.log('[PaymentProviders] Transformed provider:', provider);
          return provider;
        });
        
        // Sort: default first, then alphabetically
        providerList.sort((a, b) => {
          if (a.isDefault && !b.isDefault) return -1;
          if (!a.isDefault && b.isDefault) return 1;
          return a.name.localeCompare(b.name);
        });
        
        console.log('[PaymentProviders] Providers loaded:', providerList.length);
        console.log('[PaymentProviders] Final provider list:', providerList);
        setProviders(providerList);
        
        // Preload provider logos
        preloadProviderLogos(providerList.map(p => ({ key: p.key, name: p.name })));
      } catch (err: any) {
        console.error('[PaymentProviders] Failed to fetch:', err);
        setError(err.message || 'Failed to load payment providers');
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent">
      <div className="p-8">
        {/* Header with stats */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Service Providers</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {!loading && !error && (
                <>
                  {filteredProviders.length} of {providers.length} {providers.length === 1 ? 'provider' : 'providers'}
                  {searchQuery || selectedRegions.length > 0 || showOnlyDefault || showAllCategoriesOnly ? ' (filtered)' : ''}
                  {totalCategories > 0 && (
                    <>
                      {' • '}
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        {providers.filter(p => p.categoryIds.length / totalCategories >= 0.98).length}
                      </span>
                      {' '}with all categories
                    </>
                  )}
                </>
              )}
            </p>
          </div>
          <button
            onClick={() => setShowApiKeysModal(true)}
            className="px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <Key className="w-4 h-4" />
            API Keys
          </button>
        </div>

        {/* Filters */}
        {!loading && !error && providers.length > 0 && (
          <Card className="mb-6">
            <div className="p-6 space-y-4">
              {/* Search and Sort Row */}
              <div className="flex items-center gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by name or key..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white dark:focus:bg-white/10 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none [&>option]:bg-white [&>option]:dark:bg-gray-900"
                  >
                    <option value="categories">Most Categories</option>
                    <option value="name">A–Z</option>
                    <option value="region">Region, then Categories</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Region Filter Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Regions:</span>
                {ALL_REGIONS.map(region => {
                  const isSelected = selectedRegions.includes(region);
                  return (
                    <button
                      key={region}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedRegions(selectedRegions.filter(r => r !== region));
                        } else {
                          setSelectedRegions([...selectedRegions, region]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-200 dark:hover:bg-emerald-500/30'
                          : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10'
                      }`}
                    >
                      {region}
                    </button>
                  );
                })}
                {selectedRegions.length > 0 && (
                  <button
                    onClick={() => setSelectedRegions([])}
                    className="ml-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Filter Toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyDefault}
                    onChange={(e) => setShowOnlyDefault(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 dark:border-gray-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show only default-compatible providers</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAllCategoriesOnly}
                    onChange={(e) => setShowAllCategoriesOnly(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded border-gray-300 dark:border-gray-600 focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <span>All Categories only</span>
                    {totalCategories > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                        Full Coverage
                      </span>
                    )}
                  </span>
                </label>
              </div>
            </div>
          </Card>
        )}
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading payment providers...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="p-8">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Failed to Load Providers</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Retry
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('revelius_access_key');
                    localStorage.removeItem('revelius_secret_key');
                    localStorage.removeItem('revelius_api_keys_configured');
                    setShowApiKeysModal(true);
                  }}
                  className="px-6 py-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors inline-flex items-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Reset API Keys
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Success State */}
        {!loading && !error && (
          <>
            {filteredProviders.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <Wallet className="w-16 h-16 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {providers.length === 0 ? 'No providers found' : 'No matching providers'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {providers.length === 0 ? (
                      <>
                        No payment service providers configured in the routing table.<br />
                        <span className="text-sm">This could be due to incorrect API keys or insufficient permissions.</span>
                      </>
                    ) : (
                      'Try adjusting your search or filters.'
                    )}
                  </p>
                  {providers.length === 0 && (
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          localStorage.removeItem('revelius_access_key');
                          localStorage.removeItem('revelius_secret_key');
                          localStorage.removeItem('revelius_api_keys_configured');
                          setShowApiKeysModal(true);
                        }}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors inline-flex items-center gap-2"
                      >
                        <Key className="w-5 h-5" />
                        Reset & Configure API Keys
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <div className="space-y-12">
                {ALL_REGIONS.map((region, regionIndex) => {
                  const regionProviders = groupedProviders[region];
                  if (regionProviders.length === 0) return null;

                  return (
                    <motion.div
                      key={region}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: regionIndex * 0.1 }}
                    >
                      {/* Region Header */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20">
                          <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{region}</h3>
                        <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-sm font-semibold text-gray-600 dark:text-gray-300">
                          {regionProviders.length}
                        </span>
                      </div>

                      {/* Provider Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {regionProviders.map((provider, providerIndex) => (
                          <motion.div
                            key={provider.key}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ 
                              duration: 0.3, 
                              delay: regionIndex * 0.1 + providerIndex * 0.05 
                            }}
                          >
                            <ProviderCard
                              provider={provider}
                              totalCategories={totalCategories}
                              showDebugInfo={import.meta.env.DEV}
                              onClick={() => {
                                setSelectedProviderKey(provider.key);
                                setIsModalOpen(true);
                              }}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Provider Details Modal */}
      <ProviderDetailsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        provider={selectedProvider}
        categories={categories}
      />

      {/* API Keys Modal */}
      <ApiKeysModal 
        isOpen={showApiKeysModal} 
        onClose={() => setShowApiKeysModal(false)}
        onKeysConfigured={() => {
          setShowApiKeysModal(false);
          window.location.reload(); // Reload to fetch with new keys
        }}
      />
    </div>
  );
}
