import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Plus, X, Search, ShoppingCart, AlertCircle, Loader2, AlertTriangle, Ban } from 'lucide-react';
import { ProductsAPI } from '../api';
import type { ProductListItem } from '../types/products';
import { RoutingCanvas } from '../components/routing/RoutingCanvas';
import type { SKU } from '../demo/transactions';

type Phase = 'SELECT_PRODUCTS' | 'ROUTING_PREVIEW';

interface StepperStep {
  id: Phase;
  label: string;
  number: number;
}

const STEPS: StepperStep[] = [
  { id: 'SELECT_PRODUCTS', label: 'Select Products', number: 1 },
  { id: 'ROUTING_PREVIEW', label: 'Routing Preview', number: 2 },
];

export function TransactionsGenerateFromScanPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  // Phase management
  const [phase, setPhase] = useState<Phase>('SELECT_PRODUCTS');

  // Data state
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [routingResult, setRoutingResult] = useState<any | null>(null);

  // Loading & error state
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingRouting, setLoadingRouting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search/filter state
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products on mount
  useEffect(() => {
    if (!sessionId) return;

    async function fetchProducts() {
      setLoadingProducts(true);
      setError(null);

      try {
        console.log('[TransactionsGenerate] Fetching products for session:', sessionId);
        const response = await ProductsAPI.getAllProducts(sessionId);
        console.log('[TransactionsGenerate] Products response:', response);

        const productData = response?.data || [];
        const productsArray = Array.isArray(productData) ? productData : [];

        // Ensure each product has a unique ID
        const productsWithIds = productsArray.map((product, index) => {
          const uniqueId = product.id || `product-${index}-${Date.now()}`;
          return {
            ...product,
            id: uniqueId,
          };
        });

        setProducts(productsWithIds);
      } catch (err) {
        console.error('[TransactionsGenerate] Failed to fetch products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchProducts();
  }, [sessionId]);

  // Helper functions to extract product fields with fallbacks
  const getProductTitle = (product: ProductListItem): string => {
    return product.title || product.name || product.id || 'Untitled Product';
  };

  const getProductCategory = (product: ProductListItem): string | undefined => {
    return product.detected_category || product.category;
  };

  const getRiskLevel = (product: ProductListItem): string | undefined => {
    return product.risk_level || product.risk;
  };

  const getConfidence = (product: ProductListItem): number | undefined => {
    if (product.confidence === undefined) return undefined;
    // Normalize to 0-100 range
    return product.confidence > 1 ? product.confidence : product.confidence * 100;
  };

  const getSignals = (product: ProductListItem): string[] => {
    return product.signals || product.tags || product.keywords || [];
  };

  const getEvidence = (product: ProductListItem): string | undefined => {
    return product.evidence || product.source_url || product.page;
  };

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(product => {
      const title = getProductTitle(product).toLowerCase();
      const category = getProductCategory(product)?.toLowerCase() || '';
      const signals = getSignals(product).map(s => s.toLowerCase()).join(' ');
      
      return title.includes(query) || category.includes(query) || signals.includes(query);
    });
  }, [products, searchQuery]);

  const selectedProducts = products.filter(p => selectedIds.has(p.id));

  // Convert selected products to SKU format for RoutingCanvas
  const cartItems: SKU[] = useMemo(() => {
    return selectedProducts.map(product => ({
      id: product.id,
      name: getProductTitle(product),
      category: getProductCategory(product) || 'Uncategorized',
      price: product.price || 0,
      quantity: 1,
      risk: getRiskLevel(product) as 'high' | 'medium' | 'low' | undefined,
    }));
  }, [selectedProducts]);

  const handleBack = () => {
    navigate('/transactions');
  };

  const handleToggleProduct = (productId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleProceedToRouting = async () => {
    if (!sessionId) return;
    if (selectedIds.size === 0) {
      alert('Please select at least one product');
      return;
    }

    setLoadingRouting(true);
    setError(null); // Clear any previous errors

    try {
      // Get selected product titles/names
      const selectedProductsList = selectedProducts.map(p => getProductTitle(p));

      console.log('[TransactionsGenerate] Routing products:', selectedProductsList);

      const response = await ProductsAPI.routeProducts(sessionId, selectedProductsList);
      console.log('[TransactionsGenerate] Routing response:', response);

      setRoutingResult(response);
      setPhase('ROUTING_PREVIEW');
    } catch (err) {
      console.error('[TransactionsGenerate] Routing failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to route products');
      // Stay on routing preview phase to show error
      setPhase('ROUTING_PREVIEW');
    } finally {
      setLoadingRouting(false);
    }
  };

  const handleBackToSelection = () => {
    setPhase('SELECT_PRODUCTS');
    setError(null); // Clear any routing errors when going back
  };

  const currentStepIndex = STEPS.findIndex(s => s.id === phase);

  if (!sessionId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-transparent">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-medium mb-4">
            No session ID provided
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Transactions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Transactions</span>
        </button>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Generate Transaction Simulation
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Session: <span className="font-mono text-xs">{sessionId}</span>
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
              {STEPS.map((step, index) => {
                const isActive = step.id === phase;
                const isCompleted = index < currentStepIndex;
                const isClickable = isCompleted && !loadingRouting;

                return (
                  <div key={step.id} className="flex items-center gap-4">
                    {/* Step */}
                    <button
                      onClick={() => isClickable && setPhase(step.id)}
                      disabled={!isClickable}
                      className={`flex items-center gap-3 ${
                        isClickable ? 'cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      {/* Circle */}
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : isActive
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          step.number
                        )}
                      </div>

                      {/* Label */}
                      <span
                        className={`text-sm font-medium ${
                          isActive
                            ? 'text-gray-900 dark:text-white'
                            : isCompleted
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </button>

                    {/* Connector */}
                    {index < STEPS.length - 1 && (
                      <div
                        className={`w-16 h-0.5 ${
                          isCompleted
                            ? 'bg-emerald-600'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Content */}
        <div>
        {/* Error Banner (only for product loading errors, not routing errors) */}
        {error && phase === 'SELECT_PRODUCTS' && !loadingProducts && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 dark:text-red-300 mb-1">
                  Failed to Load Products
                </p>
                <p className="text-xs text-red-700 dark:text-red-400 mb-3">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    // Trigger refetch
                    const fetchProducts = async () => {
                      setLoadingProducts(true);
                      setError(null);

                      try {
                        console.log('[TransactionsGenerate] Fetching products for session:', sessionId);
                        const response = await ProductsAPI.getAllProducts(sessionId!);
                        console.log('[TransactionsGenerate] Products response:', response);

                        const productData = response?.data || [];
                        const productsArray = Array.isArray(productData) ? productData : [];

                        const productsWithIds = productsArray.map((product, index) => {
                          const uniqueId = product.id || `product-${index}-${Date.now()}`;
                          return {
                            ...product,
                            id: uniqueId,
                          };
                        });

                        setProducts(productsWithIds);
                      } catch (err) {
                        console.error('[TransactionsGenerate] Failed to fetch products:', err);
                        setError(err instanceof Error ? err.message : 'Failed to load products');
                      } finally {
                        setLoadingProducts(false);
                      }
                    };
                    fetchProducts();
                  }}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Phase: Select Products */}
        {phase === 'SELECT_PRODUCTS' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Product List - Stack on mobile, 2 cols on md+ */}
            <div className="md:col-span-2">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Available Products
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {filteredProducts.length} of {products.length} products
                  </p>
                </div>

                {/* Search Bar */}
                {!loadingProducts && products.length > 0 && (
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title, category, or tags..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loadingProducts && (
                  <div className="p-12 text-center">
                    <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Loading products...</p>
                  </div>
                )}

                {/* Empty State */}
                {!loadingProducts && products.length === 0 && (
                  <div className="p-12 text-center">
                    <AlertCircle className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No products found for this session
                    </p>
                  </div>
                )}

                {/* Product List */}
                {!loadingProducts && filteredProducts.length > 0 && (
                  <div className="max-h-[600px] overflow-y-auto">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredProducts.map((product) => {
                        const isSelected = selectedIds.has(product.id);
                        const title = getProductTitle(product);
                        const category = getProductCategory(product);
                        const riskLevel = getRiskLevel(product);
                        const confidence = getConfidence(product);
                        const signals = getSignals(product).slice(0, 3);
                        const evidence = getEvidence(product);

                        return (
                          <div
                            key={product.id}
                            className={`p-4 flex items-start gap-3 transition-colors ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-500/10'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                          >
                            {/* Add/Check Button */}
                            <button
                              onClick={() => handleToggleProduct(product.id)}
                              disabled={isSelected}
                              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-emerald-600 text-white cursor-default'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-110'
                              }`}
                            >
                              {isSelected ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Plus className="w-4 h-4" />
                              )}
                            </button>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              {/* Title */}
                              <p className="font-medium text-gray-900 dark:text-white truncate">
                                {title}
                              </p>

                              {/* Category & Risk & Confidence & MCC */}
                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                {category && (
                                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                    {category}
                                  </span>
                                )}
                                {riskLevel && (
                                  <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                                    riskLevel.toLowerCase().includes('high')
                                      ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                                      : riskLevel.toLowerCase().includes('medium')
                                      ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                                      : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                                  }`}>
                                    {riskLevel.toLowerCase().includes('high') && (
                                      <AlertTriangle className="w-3 h-3" />
                                    )}
                                    Risk: {riskLevel}
                                  </span>
                                )}
                                {confidence !== undefined && (
                                  <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded">
                                    {Math.round(confidence)}% confidence
                                  </span>
                                )}
                                {product.mcc_code && (
                                  <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 rounded font-mono">
                                    MCC: {product.mcc_code}
                                  </span>
                                )}
                              </div>

                              {/* Category Labels */}
                              {product.category_labels && product.category_labels.length > 0 && (
                                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                  {product.category_labels.map((label, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-2 py-0.5 bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 rounded-full"
                                    >
                                      {label}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Signals/Tags */}
                              {signals.length > 0 && (
                                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                  {signals.map((signal, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 rounded-full"
                                    >
                                      {signal}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Evidence/Source */}
                              {evidence && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">
                                  Source: {evidence}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {!loadingProducts && products.length > 0 && filteredProducts.length === 0 && (
                  <div className="p-12 text-center">
                    <Search className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No products match your search
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Cart Panel - Stack on mobile, 1 col on md+ */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden md:sticky md:top-24">
                {/* Cart Header */}
                <div className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-500/10 dark:to-blue-500/10 p-4 border-b-2 border-emerald-200 dark:border-emerald-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        Selected ({selectedProducts.length})
                      </h3>
                    </div>
                    {selectedProducts.length > 0 && (
                      <button
                        onClick={handleClearSelection}
                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium px-2 py-1 hover:bg-red-100 dark:hover:bg-red-500/20 rounded transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {selectedProducts.length === 0
                      ? 'No products selected'
                      : `${selectedProducts.length} product${selectedProducts.length !== 1 ? 's' : ''} ready`}
                  </p>
                </div>

                {/* Selected Products */}
                <div className="max-h-[400px] overflow-y-auto p-4">
                  {selectedProducts.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ShoppingCart className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Add products from the left
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Click the + button to select products
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedProducts.map((product) => {
                        const title = getProductTitle(product);
                        const riskLevel = getRiskLevel(product);

                        return (
                          <div
                            key={product.id}
                            className="group relative p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-sm transition-all"
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                  {title}
                                </p>
                                {riskLevel && (
                                  <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded mt-1 ${
                                    riskLevel.toLowerCase().includes('high')
                                      ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                                      : riskLevel.toLowerCase().includes('medium')
                                      ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                                      : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                                  }`}>
                                    {riskLevel.toLowerCase().includes('high') && (
                                      <AlertTriangle className="w-3 h-3" />
                                    )}
                                    {riskLevel}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => handleRemoveProduct(product.id)}
                                className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded transition-colors"
                                title="Remove product"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Pay Button (Sticky at bottom) */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <button
                    onClick={handleProceedToRouting}
                    disabled={selectedProducts.length === 0 || loadingRouting}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {loadingRouting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Pay {selectedProducts.length > 0 && `(${selectedProducts.length})`}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase: Routing Preview */}
        {phase === 'ROUTING_PREVIEW' && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Routing Preview
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} routed to payment providers
                </p>
              </div>
              <button
                onClick={handleBackToSelection}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Selection
              </button>
            </div>

            {/* Loading State */}
            {loadingRouting && (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Calculating optimal routes...
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Analyzing {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Error State - Preserve selection, allow retry */}
            {!loadingRouting && error && phase === 'ROUTING_PREVIEW' && (
              <div className="py-8">
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-900 dark:text-red-300 mb-1">
                        Routing Failed
                      </p>
                      <p className="text-xs text-red-700 dark:text-red-400 mb-4">{error}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                        Your selection of {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} has been preserved.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={handleProceedToRouting}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          Retry Routing
                        </button>
                        <button
                          onClick={handleBackToSelection}
                          className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          Back to Selection
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Routing Canvas */}
            {!loadingRouting && !error && routingResult && (
              <div className="space-y-6">
                <RoutingCanvas
                  cart={cartItems}
                  merchantName="Generated from Scan"
                  itemCount={selectedProducts.length}
                  mode="transaction"
                  glassTheme={true}
                  height={600}
                />
              </div>
            )}

            {/* Actions */}
            {!loadingRouting && !error && routingResult && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Generate transaction functionality to be implemented');
                  }}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Generate Transaction
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
