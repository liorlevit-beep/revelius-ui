import { useState, useEffect, useMemo } from 'react';
import { X, Plus, ShoppingCart, AlertCircle, Loader2, Search, Check, AlertTriangle, ArrowRight, CreditCard, Ban } from 'lucide-react';
import { ProductsAPI } from '../../api';
import type { ProductListItem } from '../../types/products';

interface GenerateFromScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  asPage?: boolean; // If true, renders as inline page content instead of modal
}

// Tooltip Component
function Tooltip({ children, content }: { children: React.ReactNode; content: React.ReactNode }) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-700">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800" />
      </div>
    </div>
  );
}

// Routing Visualization Component
function RoutingVisualization({ data }: { data: any }) {
  console.log('[RoutingVisualization] Full data received:', JSON.stringify(data, null, 2));

  // Try to extract routing information from various response formats
  const routingInfo = useMemo(() => {
    // Handle different possible response structures
    const responseData = data?.data || data;
    console.log('[RoutingVisualization] Extracted responseData:', responseData);
    console.log('[RoutingVisualization] Response type:', Array.isArray(responseData) ? 'Array' : typeof responseData);
    console.log('[RoutingVisualization] Response keys:', Object.keys(responseData || {}));
    
    // Check if responseData itself is an array (direct route array)
    let routesField;
    if (Array.isArray(responseData)) {
      console.log('[RoutingVisualization] Response is a direct array of routes');
      routesField = responseData;
    } else {
      // Try multiple possible field names
      routesField = responseData?.routes || 
                    responseData?.routing || 
                    responseData?.psp_routing ||
                    responseData?.routed_products ||
                    responseData?.payment_routing ||
                    responseData?.provider_mapping;
      console.log('[RoutingVisualization] Found routes field:', routesField);
    }
    
    if (routesField) {
      const routes = routesField;
      
      // Convert to normalized format: { pspName: { products: [], count: N } }
      const pspMap: Record<string, { products: string[]; count: number; reasons?: string[] }> = {};
      
      if (Array.isArray(routes)) {
        console.log('[RoutingVisualization] Routes is an array, processing...');
        console.log('[RoutingVisualization] Array length:', routes.length);
        routes.forEach((route: any, idx: number) => {
          console.log(`[RoutingVisualization] Route ${idx}:`, route);
          console.log(`[RoutingVisualization] Route ${idx} keys:`, Object.keys(route || {}));
          
          // Try multiple field names for PSP
          const psp = route.psp || 
                     route.provider || 
                     route.payment_provider || 
                     route.psp_name || 
                     route.processor ||
                     route.gateway ||
                     'Unknown PSP';
          
          // Try multiple field names for products
          const products = route.products || 
                          route.items || 
                          route.product_list || 
                          route.product_names ||
                          route.routed_products ||
                          [];
          
          const reasons = route.reasons || route.constraints || route.rules || [];
          
          console.log(`[RoutingVisualization] Route ${idx} - PSP: ${psp}, Products:`, products, 'Reasons:', reasons);
          
          if (!pspMap[psp]) {
            pspMap[psp] = { products: [], count: 0, reasons: [] };
          }
          pspMap[psp].products.push(...(Array.isArray(products) ? products : [products]));
          pspMap[psp].count = pspMap[psp].products.length;
          if (reasons.length > 0) {
            pspMap[psp].reasons = [...(pspMap[psp].reasons || []), ...reasons];
          }
        });
      } else if (typeof routes === 'object' && routes !== null) {
        console.log('[RoutingVisualization] Routes is an object, processing...');
        Object.entries(routes).forEach(([psp, items]: [string, any]) => {
          console.log(`[RoutingVisualization] PSP ${psp}:`, items);
          pspMap[psp] = {
            products: Array.isArray(items) ? items : (items?.products || items?.items || []),
            count: Array.isArray(items) ? items.length : (items?.count || items?.products?.length || 0),
            reasons: items?.reasons || items?.constraints || [],
          };
        });
      }
      
      console.log('[RoutingVisualization] Final PSP map:', pspMap);
      
      // Handle blocked products - could be at top level or not present
      const blocked = Array.isArray(responseData) 
        ? [] // If response is array, no top-level blocked field
        : (responseData.blocked || responseData.blocked_products || responseData.blocked_items || []);
      
      const blockedReasons = Array.isArray(responseData)
        ? {}
        : (responseData.blocked_reasons || responseData.block_reasons || {});
      
      console.log('[RoutingVisualization] Blocked products:', blocked);
      console.log('[RoutingVisualization] Blocked reasons:', blockedReasons);
      
      return {
        psps: pspMap,
        blocked,
        blockedReasons,
      };
    }
    
    // Fallback: try to find any array or object that might contain routing info
    console.log('[RoutingVisualization] No recognized routing format found, using fallback');
    return {
      psps: {},
      blocked: [],
      blockedReasons: {},
      rawData: responseData,
    };
  }, [data]);

  const pspEntries = Object.entries(routingInfo.psps);
  const hasRouting = pspEntries.length > 0;
  const totalRouted = pspEntries.reduce((sum, [_, info]) => sum + info.count, 0);

  // If we have routing data, show visual representation
  if (hasRouting) {
    return (
      <div className="space-y-6">
        {/* Visual Graph */}
        <div className="relative">
          {/* Cart Node (Left) */}
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0">
              <div className="relative w-24 h-24 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 shadow-lg flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-white" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gray-900 text-white text-xs rounded-full font-medium">
                  Cart
                </div>
              </div>
            </div>

            {/* PSP Nodes (Right) */}
            <div className="flex-1 space-y-3">
              {pspEntries.map(([psp, info], idx) => (
                <div key={psp} className="relative">
                  {/* Edge/Arrow */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                    <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-full">
                      {info.count}
                    </span>
                  </div>

                  {/* PSP Node */}
                  <Tooltip
                    content={
                      <div className="text-left max-w-xs">
                        <div className="font-semibold mb-2">{psp}</div>
                        <div className="text-gray-300 mb-1">
                          {info.count} product{info.count !== 1 ? 's' : ''} routed
                        </div>
                        {info.reasons && info.reasons.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-700">
                            <div className="text-xs text-amber-400">Constraints/Reasons:</div>
                            {info.reasons.map((reason, i) => (
                              <div key={i} className="text-xs text-gray-300">• {reason}</div>
                            ))}
                          </div>
                        )}
                        {info.products.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-700">
                            <div className="text-xs text-gray-400">Products:</div>
                            {info.products.slice(0, 5).map((p, i) => (
                              <div key={i} className="text-xs text-gray-300 truncate">• {p}</div>
                            ))}
                            {info.products.length > 5 && (
                              <div className="text-xs text-gray-400">
                                +{info.products.length - 5} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    }
                  >
                    <div className="p-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {psp}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {info.count} product{info.count !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed List */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">
            Routing Details
          </h4>
          <div className="space-y-3">
            {pspEntries.map(([psp, info]) => (
              <div key={psp} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {psp}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-full">
                    {info.count} routed
                  </span>
                </div>
                {info.reasons && info.reasons.length > 0 && (
                  <div className="mb-2 p-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded">
                    <p className="text-xs font-medium text-amber-900 dark:text-amber-300 mb-1">
                      Constraints:
                    </p>
                    {info.reasons.map((reason, idx) => (
                      <p key={idx} className="text-xs text-amber-700 dark:text-amber-400">
                        • {reason}
                      </p>
                    ))}
                  </div>
                )}
                {info.products.length > 0 && (
                  <div className="space-y-1">
                    {info.products.map((product, idx) => (
                      <p key={idx} className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        • {product}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Blocked Products */}
        {routingInfo.blocked.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Ban className="w-4 h-4 text-red-600 dark:text-red-400" />
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                Blocked Products ({routingInfo.blocked.length})
              </h4>
            </div>
            <div className="space-y-2">
              {routingInfo.blocked.map((product: any, idx: number) => {
                const productName = typeof product === 'string' ? product : product.name || product.id;
                const reason = routingInfo.blockedReasons[productName] || product.reason || 'No reason provided';
                
                return (
                  <div key={idx} className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg p-3">
                    <p className="text-sm font-medium text-red-900 dark:text-red-300">
                      {productName}
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                      {reason}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {totalRouted}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Routed
              </p>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {pspEntries.length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                PSPs
              </p>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-500/10 rounded-lg">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {routingInfo.blocked.length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Blocked
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback: Show raw data as JSON
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-300">
              Unknown Response Format
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
              The routing response format is not recognized. Check the browser console for detailed logs.
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
              <strong>Response type:</strong> {Array.isArray(routingInfo.rawData) ? 'Array' : typeof routingInfo.rawData}
            </p>
            {!Array.isArray(routingInfo.rawData) && (
              <>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  <strong>Expected fields:</strong> routes, routing, psp_routing, routed_products, payment_routing, or provider_mapping
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  <strong>Received keys:</strong> {Object.keys(routingInfo.rawData || {}).join(', ') || 'none'}
                </p>
              </>
            )}
            {Array.isArray(routingInfo.rawData) && (
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                <strong>Array length:</strong> {routingInfo.rawData.length} items
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto max-h-96">
        <div className="mb-2 text-xs text-gray-400">Raw response from POST /products/router:</div>
        <pre className="text-xs text-gray-100">
          {JSON.stringify(routingInfo.rawData || data, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export function GenerateFromScanModal({ isOpen, onClose, sessionId, asPage = false }: GenerateFromScanModalProps) {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [didClickPay, setDidClickPay] = useState(false);
  const [routingLoading, setRoutingLoading] = useState(false);
  const [routingData, setRoutingData] = useState<any>(null);
  const [routingError, setRoutingError] = useState<string | null>(null);
  const [animatingProductId, setAnimatingProductId] = useState<string | null>(null);

  // Fetch products when modal opens
  useEffect(() => {
    if (isOpen && sessionId) {
      fetchProducts();
      setDidClickPay(false);
      setRoutingData(null);
      setRoutingError(null);
    }
  }, [isOpen, sessionId]);

  // Reset routing state when selection changes
  useEffect(() => {
    setDidClickPay(false);
    setRoutingData(null);
    setRoutingError(null);
  }, [selectedIds.size]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('[GenerateFromScanModal] Fetching products for session:', sessionId);
      const response = await ProductsAPI.getAllProducts(sessionId);
      console.log('[GenerateFromScanModal] Products response:', response);
      
      // Extract products from response
      const productData = response?.data || [];
      const productsArray = Array.isArray(productData) ? productData : [];
      
      // Ensure each product has a unique ID
      const productsWithIds = productsArray.map((product, index) => {
        // Use existing ID if it exists and is unique, otherwise generate one
        const uniqueId = product.id || `product-${index}-${Date.now()}`;
        console.log(`[GenerateFromScanModal] Product ${index}:`, { id: uniqueId, title: product.title || product.name });
        return {
          ...product,
          id: uniqueId,
        };
      });
      
      console.log('[GenerateFromScanModal] Products with IDs:', productsWithIds.map(p => ({ id: p.id, title: p.title || p.name })));
      setProducts(productsWithIds);
    } catch (err) {
      console.error('[GenerateFromScanModal] Failed to fetch products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleProduct = (productId: string) => {
    console.log('[handleToggleProduct] Toggling product:', productId);
    console.log('[handleToggleProduct] Current selected IDs:', Array.from(selectedIds));
    
    setSelectedIds(prev => {
      const next = new Set(prev);
      console.log('[handleToggleProduct] Previous set:', Array.from(prev));
      console.log('[handleToggleProduct] Checking if already selected:', next.has(productId));
      
      if (next.has(productId)) {
        next.delete(productId);
        console.log('[handleToggleProduct] Removed product');
      } else {
        // Trigger animation when adding
        setAnimatingProductId(productId);
        setTimeout(() => setAnimatingProductId(null), 600);
        next.add(productId);
        console.log('[handleToggleProduct] Added product');
      }
      
      console.log('[handleToggleProduct] New set:', Array.from(next));
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
  };

  const handlePayClick = async () => {
    setDidClickPay(true);
    setRoutingLoading(true);
    setRoutingError(null);
    setRoutingData(null);

    try {
      // Get selected products - try to use title/name, fallback to id
      const selectedProductsList = selectedProducts.map(p => 
        getProductTitle(p) || p.id
      );

      console.log('[GenerateFromScanModal] Calling routing API with products:', selectedProductsList);

      const response = await ProductsAPI.routeProducts(sessionId, selectedProductsList);
      
      console.log('[GenerateFromScanModal] Routing response:', response);
      setRoutingData(response);
    } catch (err) {
      console.error('[GenerateFromScanModal] Routing failed:', err);
      setRoutingError(err instanceof Error ? err.message : 'Failed to route products');
    } finally {
      setRoutingLoading(false);
    }
  };

  // Helper functions to extract fields with fallbacks
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
  
  // Debug: Log if there's a count mismatch
  useEffect(() => {
    if (selectedIds.size !== selectedProducts.length) {
      console.warn('[GenerateFromScanModal] COUNT MISMATCH:', {
        selectedIdsSize: selectedIds.size,
        selectedProductsLength: selectedProducts.length,
        selectedIdsArray: Array.from(selectedIds),
        selectedProductsIds: selectedProducts.map(p => p.id),
        allProductIds: products.map(p => p.id),
      });
      
      // Fix: Remove any IDs from selectedIds that don't exist in products
      const validProductIds = new Set(products.map(p => p.id));
      const invalidIds = Array.from(selectedIds).filter(id => !validProductIds.has(id));
      
      if (invalidIds.length > 0) {
        console.warn('[GenerateFromScanModal] Found invalid IDs, removing:', invalidIds);
        setSelectedIds(prev => {
          const cleaned = new Set(Array.from(prev).filter(id => validProductIds.has(id)));
          return cleaned;
        });
      }
    }
  }, [selectedIds, selectedProducts.length, products]);

  if (!isOpen) return null;

  const contentWrapper = (
    <>
      {/* CSS Animations */}
      <style>{`
        @keyframes flyToCart {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(200px, -100px) scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: translate(400px, -200px) scale(0);
            opacity: 0;
          }
        }
        
        @media (max-width: 1024px) {
          @keyframes flyToCart {
            0% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(0, -100px) scale(0);
              opacity: 0;
            }
          }
        }
        
        .animate-fly-to-cart {
          animation: flyToCart 0.6s ease-out forwards;
        }
      `}</style>
      
      <div 
        className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
      >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1 min-w-0 mr-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                Generate from Scan
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                Session: {sessionId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Content - 3 Column Layout (Responsive) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 h-auto lg:h-[600px] max-h-[80vh] overflow-y-auto lg:overflow-y-hidden">
            {/* Left Column - Product List */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col h-[500px] lg:h-auto">
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Available Products
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {filteredProducts.length} of {products.length} products
                </p>
              </div>

              {/* Search Bar - Sticky */}
              {!isLoading && !error && products.length > 0 && (
                <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
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
              {isLoading && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Loading products...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="text-center">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
                    <p className="text-sm text-red-700 dark:text-red-400 font-medium mb-2">
                      Failed to load products
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                    <button
                      onClick={fetchProducts}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {/* Product List */}
              {!isLoading && !error && (
                <div className="flex-1 overflow-y-auto">
                  {filteredProducts.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        {searchQuery ? (
                          <>
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
                          </>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No products found
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredProducts.map((product, idx) => {
                        const isSelected = selectedIds.has(product.id);
                        if (idx === 0) {
                          console.log('[Render] First product:', { id: product.id, isSelected, selectedIds: Array.from(selectedIds) });
                        }
                        const title = getProductTitle(product);
                        const category = getProductCategory(product);
                        const riskLevel = getRiskLevel(product);
                        const confidence = getConfidence(product);
                        const signals = getSignals(product).slice(0, 3);
                        const evidence = getEvidence(product);

                        const isAnimating = animatingProductId === product.id;
                        
                        return (
                          <div
                            key={product.id}
                            className={`p-4 flex items-start gap-3 transition-all ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-500/10'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                            } ${
                              isAnimating ? 'animate-pulse scale-95' : ''
                            }`}
                          >
                            <Tooltip
                              content={
                                <div className="text-left">
                                  <div className="font-semibold mb-1">{title}</div>
                                  {category && (
                                    <div className="text-gray-300 mb-1">Category: {category}</div>
                                  )}
                                  {riskLevel && (
                                    <div className="text-gray-300 mb-1">Risk: {riskLevel}</div>
                                  )}
                                  {confidence !== undefined && (
                                    <div className="text-gray-300 mb-1">Confidence: {Math.round(confidence)}%</div>
                                  )}
                                  {product.mcc_code && (
                                    <div className="text-gray-300 mb-1 font-mono">MCC: {product.mcc_code}</div>
                                  )}
                                  {product.category_labels && product.category_labels.length > 0 && (
                                    <div className="text-gray-300 mb-1">
                                      Labels: {product.category_labels.join(', ')}
                                    </div>
                                  )}
                                  {evidence && (
                                    <div className="text-gray-300 text-xs max-w-xs truncate">
                                      Source: {evidence}
                                    </div>
                                  )}
                                </div>
                              }
                            >
                              <button
                                onClick={() => handleToggleProduct(product.id)}
                                disabled={isSelected}
                                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'bg-emerald-600 text-white cursor-default'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-110'
                                } ${
                                  isAnimating ? 'scale-125 rotate-90' : ''
                                }`}
                              >
                                {isSelected ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <Plus className="w-4 h-4" />
                                )}
                              </button>
                            </Tooltip>
                            <div className="flex-1 min-w-0">
                              {/* Title */}
                              <p className="font-medium text-gray-900 dark:text-white">
                                {title}
                              </p>

                              {/* Category & Risk Level */}
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
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
                  )}
                </div>
              )}
            </div>

            {/* Middle Column - Cart Node */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col h-[500px] lg:h-auto">
              {/* Visual Node at Top */}
              <div className="p-4">
                <div className={`relative rounded-xl p-4 border-2 border-emerald-300 dark:border-emerald-500/50 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-500/10 dark:to-blue-500/10 shadow-lg transition-all ${
                  animatingProductId ? 'scale-105 shadow-2xl' : ''
                }`}>
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 rounded-xl bg-emerald-400/20 dark:bg-emerald-500/20 blur-xl transition-opacity ${
                    animatingProductId ? 'opacity-100' : 'opacity-50'
                  }`} />
                  
                  {/* Content */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
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
                        : `${selectedProducts.length} product${selectedProducts.length !== 1 ? 's' : ''} ready for payment`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Selected Products as Chips */}
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                {selectedProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
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
                      const category = getProductCategory(product);
                      const riskLevel = getRiskLevel(product);
                      const confidence = getConfidence(product);
                      const signals = getSignals(product);
                      const evidence = getEvidence(product);
                      
                      return (
                        <div
                          key={product.id}
                          className="group relative p-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start gap-2">
                            <div className="flex-1 min-w-0 space-y-2">
                              {/* Title */}
                              <p className="font-medium text-gray-900 dark:text-white text-sm">
                                {title}
                              </p>
                              
                              {/* Category & Risk in one row */}
                              <div className="flex items-center gap-2 flex-wrap">
                                {category && (
                                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                    {category}
                                  </span>
                                )}
                                
                                {riskLevel && (
                                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded ${
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
                                <div className="flex items-center gap-1 flex-wrap">
                                  {product.category_labels.map((label, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-1.5 py-0.5 bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 rounded-full"
                                    >
                                      {label}
                                    </span>
                                  ))}
                                </div>
                              )}
                              
                              {/* Signals/Tags */}
                              {signals.length > 0 && (
                                <div className="flex items-center gap-1 flex-wrap">
                                  {signals.slice(0, 3).map((signal, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 rounded"
                                    >
                                      {signal}
                                    </span>
                                  ))}
                                  {signals.length > 3 && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      +{signals.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              {/* Evidence/Source */}
                              {evidence && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  Source: {evidence}
                                </p>
                              )}
                              
                              {/* Price (if available) */}
                              {product.price !== undefined && (
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                  ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                                </p>
                              )}
                              
                              {/* Description (if available) */}
                              {product.description && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                  {product.description}
                                </p>
                              )}
                            </div>
                            
                            {/* Remove Button */}
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

              {/* Pay CTA Button */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <button
                  onClick={handlePayClick}
                  disabled={selectedProducts.length === 0 || routingLoading}
                  className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-base shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {routingLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Routing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Pay {selectedProducts.length > 0 && `(${selectedProducts.length})`}
                    </>
                  )}
                </button>
                
                {didClickPay && routingData && !routingLoading && (
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded text-xs text-green-700 dark:text-green-400 text-center">
                    ✓ Routing complete - see preview on the right
                  </div>
                )}
                
                {didClickPay && routingError && !routingLoading && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded text-xs text-red-700 dark:text-red-400 text-center">
                    ✗ Routing failed - check the preview panel
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Routing Preview */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col h-[500px] lg:h-auto">
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Routing Preview
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {!didClickPay
                    ? 'Click Pay to generate routing'
                    : routingLoading
                    ? 'Generating routes...'
                    : routingData
                    ? 'Payment routing visualization'
                    : 'Waiting for data'}
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {/* Empty State */}
                {!didClickPay && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-transparent rounded-full opacity-30" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Select products and click Pay
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Routing will be generated here
                    </p>
                  </div>
                )}

                {/* Loading State */}
                {didClickPay && routingLoading && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Generating payment routing...
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Please wait
                    </p>
                  </div>
                )}

                {/* Error State */}
                {didClickPay && routingError && !routingLoading && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mb-4" />
                    <p className="text-sm font-medium text-red-900 dark:text-red-300 mb-2">
                      Routing Failed
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center max-w-xs">
                      {routingError}
                    </p>
                    <button
                      onClick={handlePayClick}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Routing Visualization */}
                {didClickPay && routingData && !routingLoading && !routingError && (
                  <RoutingVisualization data={routingData} />
                )}
              </div>
            </div>
          </div>
        </div>
    </>
  );
  
  // For modal mode, wrap in backdrop and positioning
  if (!asPage) {
    return (
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
          <div onClick={(e) => e.stopPropagation()}>
            {contentWrapper}
          </div>
        </div>
      </div>
    );
  }
  
  return contentWrapper;
}
