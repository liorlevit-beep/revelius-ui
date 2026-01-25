import { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Store, Zap, CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoutingTable } from '../../hooks/useRoutingTable';
import { getProviderDisplayName } from '../../data/providerRegions';
import { ProviderRouteModal } from './ProviderRouteModal';
import { computeCartEligibility } from '../../utils/routingEligibility';
import { PaymentProviderLogo } from '../paymentProviders/PaymentProviderLogo';
import type { SKU, LineItem } from '../../demo/transactions';

// Types
interface Point {
  x: number;
  y: number;
}

type PortId = string;

interface Port {
  id: PortId;
  x: number;
  y: number;
}

interface PathData {
  d: string;
  color: string;
  pspName: string;
}

interface TokenData {
  itemId: string;
  pspName: string;
  title: string;
  type: string;
  offsetSeconds: number;
  speedMs: number;
}

interface RouteStatus {
  pspName: string;
  status: 'Approved' | 'Review' | 'Blocked';
  count: number;
}

interface RoutingCanvasProps {
  cart?: SKU[];
  lineItems?: LineItem[];
  merchantName?: string;
  merchantCountry?: string;
  selectedProvider?: string;
  onProviderSelect?: (provider: string) => void;
  height?: number;
  // Transaction context props
  transactionId?: string;
  transactionAmount?: number;
  transactionCurrency?: string;
  itemCount?: number;
  // Merchant context props
  mode?: 'transaction' | 'merchant'; // Default: 'transaction'
  activeProviders?: string[]; // For merchant mode: list of all active providers
  glassTheme?: boolean;
}

// Provider configuration - Default/fallback config
const DEFAULT_PSP_CONFIG: Record<string, { color: string; logo: string }> = {
  stripe: { color: '#635BFF', logo: 'https://cdn.brandfetch.io/stripe.com/w/400/h/400/theme/dark/icon.jpeg' },
  adyen: { color: '#0ABF53', logo: 'https://cdn.brandfetch.io/adyen.com/w/400/h/400/theme/dark/icon.jpeg' },
  fiserv: { color: '#FF6600', logo: 'https://cdn.brandfetch.io/fiserv.com/w/400/h/400/theme/dark/icon.jpeg' },
  checkout: { color: '#6C5CE7', logo: 'https://cdn.brandfetch.io/checkout.com/w/400/h/400/theme/dark/icon.jpeg' },
  worldpay: { color: '#D62828', logo: 'https://logo.clearbit.com/worldpay.com' },
  rapyd: { color: '#00C48C', logo: 'https://logo.clearbit.com/rapyd.net' },
  braintree: { color: '#00AA6C', logo: 'https://logo.clearbit.com/braintreepayments.com' },
  square: { color: '#000000', logo: 'https://logo.clearbit.com/squareup.com' },
  paypal: { color: '#003087', logo: 'https://logo.clearbit.com/paypal.com' },
  authorize: { color: '#0085CA', logo: 'https://logo.clearbit.com/authorize.net' },
};

// Stable color palette for providers not in default config
const PROVIDER_COLORS = [
  '#635BFF', '#0ABF53', '#FF6600', '#6C5CE7', '#D62828',
  '#00C48C', '#00AA6C', '#000000', '#003087', '#0085CA',
  '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6',
];

function getProviderConfig(providerKey: string, index: number): { color: string; logo: string } {
  const lowerKey = providerKey.toLowerCase();
  
  if (DEFAULT_PSP_CONFIG[lowerKey]) {
    return DEFAULT_PSP_CONFIG[lowerKey];
  }
  
  const colorIndex = index % PROVIDER_COLORS.length;
  return {
    color: PROVIDER_COLORS[colorIndex],
    logo: `https://logo.clearbit.com/${lowerKey}.com`
  };
}

// Cubic bezier point calculation
function cubicBezierPoint(t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point {
  const t2 = t * t;
  const t3 = t2 * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  
  return {
    x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y
  };
}

// Port Management Hook
function usePorts(canvasRef: React.RefObject<HTMLDivElement>) {
  const [portsById, setPortsById] = useState<Map<PortId, Port>>(new Map());
  const portRefsMap = useRef<Map<PortId, HTMLElement>>(new Map());
  const computeTimeoutRef = useRef<number | null>(null);

  const registerPortRef = useCallback((portId: PortId) => {
    return (element: HTMLElement | null) => {
      if (element) {
        portRefsMap.current.set(portId, element);
      } else {
        portRefsMap.current.delete(portId);
      }
    };
  }, []);

  const computePorts = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newPorts = new Map<PortId, Port>();

    portRefsMap.current.forEach((element, portId) => {
      const rect = element.getBoundingClientRect();
      
      const localX = rect.left - canvasRect.left;
      const localY = rect.top - canvasRect.top;
      
      let x = localX;
      let y = localY + rect.height / 2;
      
      if (portId.includes(':out')) {
        x = localX + rect.width;
        y = localY + rect.height / 2;
      } else if (portId.includes(':in')) {
        x = localX;
        y = localY + rect.height / 2;
      }
      
      newPorts.set(portId, { id: portId, x, y });
    });

    setPortsById(prevPorts => {
      if (prevPorts.size !== newPorts.size) return newPorts;
      
      let changed = false;
      newPorts.forEach((port, portId) => {
        const prevPort = prevPorts.get(portId);
        if (!prevPort || Math.abs(prevPort.x - port.x) > 0.5 || Math.abs(prevPort.y - port.y) > 0.5) {
          changed = true;
        }
      });
      
      return changed ? newPorts : prevPorts;
    });
  }, []);

  const requestRecompute = useCallback(() => {
    if (computeTimeoutRef.current !== null) {
      window.clearTimeout(computeTimeoutRef.current);
    }
    computeTimeoutRef.current = window.setTimeout(() => {
      computePorts();
      computeTimeoutRef.current = null;
    }, 50);
  }, [computePorts]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const resizeObserver = new ResizeObserver(requestRecompute);
    resizeObserver.observe(canvasRef.current);

    window.addEventListener('resize', requestRecompute);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', requestRecompute);
      if (computeTimeoutRef.current !== null) {
        window.clearTimeout(computeTimeoutRef.current);
      }
    };
  }, [requestRecompute]);

  return { registerPortRef, portsById, recomputePorts: computePorts };
}

export function RoutingCanvas({
  cart = [],
  lineItems = [],
  merchantName = 'Merchant',
  merchantCountry,
  selectedProvider,
  onProviderSelect,
  height = 500,
  transactionId,
  transactionAmount,
  transactionCurrency,
  itemCount,
  mode = 'transaction',
  activeProviders = [],
  glassTheme = false,
}: RoutingCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Get routing table for dynamic providers
  const { data: routingTable, providers: availableProviders } = useRoutingTable();
  
  // Port system
  const { registerPortRef, portsById, recomputePorts } = usePorts(canvasRef as React.RefObject<HTMLDivElement>);
  
  const [paths, setPaths] = useState<PathData[]>([]);
  const [tokenPaths, setTokenPaths] = useState<Map<string, Point[]>>(new Map());
  const [merchantPath, setMerchantPath] = useState<string>('');
  const [hoveredPsp, setHoveredPsp] = useState<string | null>(null);
  const [modalProvider, setModalProvider] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  
  // Frozen snapshot of token paths for current animation cycle
  const [frozenTokenPaths, setFrozenTokenPaths] = useState<Map<string, Point[]>>(new Map());
  
  // Pan and Zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  
  const MAX_VISIBLE_PROVIDERS = 6;
  
  // Dynamic provider configuration - use fallback if no providers yet
  const pspConfig = useMemo(() => {
    const providers = (availableProviders && availableProviders.length > 0)
      ? availableProviders 
      : ['stripe', 'adyen', 'checkout', 'braintree', 'rapyd'];
    
    const config: Record<string, { color: string; logo: string }> = {};
    providers.forEach((provider, index) => {
      config[provider] = getProviderConfig(provider, index);
    });
    
    return config;
  }, [availableProviders, mode]);
  
  const visibleProviders = useMemo(() => {
    if (!pspConfig) return [];
    const allProviders = Object.keys(pspConfig);
    const visible = allProviders.slice(0, MAX_VISIBLE_PROVIDERS);
    return visible;
  }, [pspConfig]);
  
  const hasMoreProviders = pspConfig ? Object.keys(pspConfig).length > MAX_VISIBLE_PROVIDERS : false;
  
  // Convert lineItems or cart to SKUs for eligibility calculation
  const skus = useMemo<SKU[]>(() => {
    if (cart && cart.length > 0) {
      return cart;
    }
    if (lineItems && lineItems.length > 0) {
      return lineItems.map(item => ({
        sku_id: item.sku || `item-${Math.random()}`,
        title: item.name || 'Item',
        quantity: item.quantity || 1,
        price: item.price || 0,
        product_url: `https://example.com/products/${item.sku || 'unknown'}`,
        evidence_items: [],
        category_id: item.categoryId,
      }));
    }
    return [];
  }, [cart, lineItems]);
  
  // Compute eligibility for modal
  const eligibilityResult = useMemo(() => {
    if (skus.length === 0 || !routingTable) return null;
    return computeCartEligibility(skus, routingTable);
  }, [skus, routingTable]);
  
  // Ensure there's always a selected provider (default to first eligible, or first provider)
  const activeSelectedProvider = useMemo(() => {
    // Safety check
    if (!visibleProviders || visibleProviders.length === 0) {
      return null;
    }
    
    // If a selection is provided, try to match it (case-insensitive)
    if (selectedProvider) {
      const selectedLower = selectedProvider.toLowerCase();
      
      // Try exact match first
      if (visibleProviders.includes(selectedLower)) {
        return selectedLower;
      }
      
      // Try matching by display name (e.g., "Stripe" -> "stripe")
      const matchedProvider = visibleProviders.find(p => {
        const displayName = getProviderDisplayName(p).toLowerCase();
        return displayName === selectedLower || p.toLowerCase() === selectedLower;
      });
      
      if (matchedProvider) {
        return matchedProvider;
      }
    }
    
    // If no selection provided, default to first eligible provider with full coverage
    if (eligibilityResult && eligibilityResult.eligibleProviders && eligibilityResult.eligibleProviders.length > 0) {
      const bestProvider = eligibilityResult.eligibleProviders.find(p => p && p.isFullCoverage);
      if (bestProvider && visibleProviders.includes(bestProvider.provider)) {
        return bestProvider.provider;
      }
      
      // Otherwise, use the first eligible provider
      const firstEligible = eligibilityResult.eligibleProviders.find(p => 
        p && visibleProviders.includes(p.provider)
      );
      if (firstEligible) {
        return firstEligible.provider;
      }
    }
    
    // Fallback to first visible provider
    return visibleProviders[0];
  }, [selectedProvider, eligibilityResult, visibleProviders]);
  
  // Build routing model - behavior depends on mode
  const routingModel = useMemo<RouteStatus[]>(() => {
    if (!visibleProviders || visibleProviders.length === 0) return [];
    
    const model = visibleProviders.map((pspName) => {
      const coverage = eligibilityResult?.eligibleProviders?.find(p => p && p.provider === pspName);
      const hasFullCoverage = coverage?.coveragePercentage === 100;
      const hasPartialCoverage = coverage && coverage.coveragePercentage > 0;
      
      // Determine if this provider is active based on mode
      let isActive = false;
      if (mode === 'merchant') {
        // Merchant mode: multiple providers can be active
        if (activeProviders.length > 0) {
          isActive = activeProviders.includes(pspName);
        } else {
          // Default: show all visible providers as active in merchant mode
          isActive = true;
        }
      } else {
        // Transaction mode: only selected provider is active
        isActive = activeSelectedProvider === pspName;
      }
      
      // Determine status
      let status: 'Approved' | 'Review' | 'Blocked';
      if (mode === 'merchant') {
        // In merchant mode, all active providers are approved
        status = isActive ? 'Approved' : 'Blocked';
      } else {
        // Transaction mode: use eligibility
        if (hasFullCoverage) {
          status = 'Approved';
        } else if (hasPartialCoverage) {
          status = 'Review';
        } else if (isActive && !eligibilityResult) {
          status = 'Approved';
        } else {
          status = 'Blocked';
        }
      }
      
      return {
        pspName,
        status,
        count: isActive ? (coverage?.coverageCount || skus?.length || 5) : 0, // Default to 5 items for merchant mode
      };
    });
    
    return model;
  }, [visibleProviders, eligibilityResult, activeSelectedProvider, skus, mode, activeProviders]);
  
  // Get coverage for modal
  const modalCoverage = eligibilityResult?.eligibleProviders.find(p => p.provider === modalProvider);
  
  // Build SKU analysis for modal
  const skuAnalysis = useMemo(() => {
    if (!modalProvider || !routingTable || !modalCoverage || !routingTable.mapping) return {};
    
    const analysis: Record<string, string[]> = {};
    if (!routingTable || !routingTable.mapping) {
      return analysis;
    }
    
    skus.forEach(sku => {
      const categoryId = sku.category_id || 'unknown';
      const mapping = routingTable.mapping[modalProvider];
      
      if (mapping && Array.isArray(mapping) && mapping.includes(categoryId)) {
        if (!analysis[sku.sku_id]) {
          analysis[sku.sku_id] = [];
        }
        analysis[sku.sku_id].push(modalProvider);
      }
    });
    
    return analysis;
  }, [modalProvider, routingTable, modalCoverage, skus]);
  
  // Generate tokens - more tokens in merchant mode
  const tokens = useMemo<TokenData[]>(() => {
    if (!visibleProviders || visibleProviders.length === 0) return [];
    if (!routingModel || routingModel.length === 0) return [];
    
    // In merchant mode without SKUs, generate mock tokens
    const itemsToProcess = (skus && skus.length > 0) 
      ? skus 
      : (mode === 'merchant' ? [
          { sku_id: 'item-1', title: 'Product A', category_id: 'electronics' },
          { sku_id: 'item-2', title: 'Product B', category_id: 'apparel' },
          { sku_id: 'item-3', title: 'Product C', category_id: 'home' },
        ] : []);
    
    if (itemsToProcess.length === 0) return [];
    
    const tokenList: TokenData[] = [];
    const tokensPerProvider = mode === 'merchant' ? 3 : 2; // More tokens in merchant mode
    
    visibleProviders.forEach((pspName, pspIndex) => {
      const route = routingModel.find(r => r.pspName === pspName);
      if (!route || route.count === 0) return; // Only show tokens for active routes
      
      // In merchant mode, stagger tokens differently for simultaneous flow
      const baseDelay = mode === 'merchant' ? (pspIndex * 0.2) : (pspIndex * 0.3);
      
      itemsToProcess.slice(0, Math.min(tokensPerProvider, itemsToProcess.length)).forEach((item, skuIndex) => {
        tokenList.push({
          itemId: `${item.sku_id}-${pspName}-${pspIndex}-${skuIndex}`,
          pspName,
          title: (item as any).title || 'Item',
          type: (item as any).category_id || 'item',
          offsetSeconds: baseDelay + (skuIndex * 0.15),
          speedMs: 2000 + Math.random() * 500,
        });
      });
    });
    return mode === 'merchant' ? tokenList : tokenList.slice(0, 12); // More tokens allowed in merchant mode
  }, [skus, visibleProviders, routingModel, mode]);
  
  // Layout calculation state
  const [layout, setLayout] = useState({
    merchantX: 150,
    reveliusX: 400,
    pspStartX: 700,
    contentWidth: 1000,
    contentHeight: height,
  });

  // Calculate layout
  const calculateLayout = useCallback(() => {
    if (!canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const canvasWidth = canvasRect.width;

    const merchantNodeSize = 64;
    const reveliusNodeSize = 96;
    const pspWidth = 220;
    
    const merchantToReveliusGap = canvasWidth * 0.15;
    const reveliusToPspGap = canvasWidth * 0.15;
    
    const totalWidth = merchantNodeSize + merchantToReveliusGap + reveliusNodeSize + reveliusToPspGap + pspWidth + 100;
    
    const merchantX = (canvasWidth - totalWidth) / 2 + merchantNodeSize / 2;
    const reveliusX = merchantX + merchantNodeSize / 2 + merchantToReveliusGap + reveliusNodeSize / 2;
    const pspStartX = reveliusX + reveliusNodeSize / 2 + reveliusToPspGap;
    
    setLayout({
      merchantX,
      reveliusX,
      pspStartX,
      contentWidth: canvasWidth,
      contentHeight: height,
    });
  }, [height]);

  // Calculate paths
  const calculatePaths = useCallback(() => {
    if (portsById.size === 0) {
      setPaths([]);
      setTokenPaths(new Map());
      setMerchantPath('');
      return;
    }

    const merchantOut = portsById.get("merchant:out");
    const reveliusIn = portsById.get("revelius:in");
    const reveliusOut = portsById.get("revelius:out");

    if (!merchantOut || !reveliusIn || !reveliusOut) return;

    const merchantToRevelius = `M ${merchantOut.x} ${merchantOut.y} L ${reveliusIn.x} ${reveliusIn.y}`;
    setMerchantPath(merchantToRevelius);

    const newPaths: PathData[] = [];
    const newTokenPaths = new Map<string, Point[]>();
    
    visibleProviders.forEach(pspName => {
      const portKey = `psp:${pspName}:in`;
      const pspPort = portsById.get(portKey);
      if (!pspPort) {
        return;
      }


      const startX = reveliusOut.x;
      const startY = reveliusOut.y;
      const endX = pspPort.x;
      const endY = pspPort.y;

      const dx = endX - startX;
      const c1x = startX + dx * 0.45;
      const c1y = startY;
      const c2x = startX + dx * 0.70;
      const c2y = endY;

      const pathD = `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`;

      const pathColor = pspConfig[pspName]?.color || '#9CA3AF';
      
      newPaths.push({
        d: pathD,
        color: pathColor,
        pspName
      });

      // Sample points along the bezier curve
      const points: Point[] = [];
      const p0 = { x: startX, y: startY };
      const p1 = { x: c1x, y: c1y };
      const p2 = { x: c2x, y: c2y };
      const p3 = { x: endX, y: endY };

      for (let i = 0; i <= 40; i++) {
        const t = i / 40;
        points.push(cubicBezierPoint(t, p0, p1, p2, p3));
      }

      newTokenPaths.set(pspName, points);
    });
    
    setPaths(newPaths);
    setTokenPaths(newTokenPaths);
  }, [portsById, visibleProviders, pspConfig]);

  // Layout effects
  useLayoutEffect(() => {
    calculateLayout();
  }, [calculateLayout]);

  useLayoutEffect(() => {
    recomputePorts();
  }, [layout, recomputePorts]);

  useEffect(() => {
    calculatePaths();
  }, [calculatePaths]);
  
  // Freeze token paths when animation key changes (snapshot for this animation cycle)
  useEffect(() => {
    // Create a deep copy of the current token paths
    const snapshot = new Map<string, Point[]>();
    tokenPaths.forEach((points, key) => {
      // Deep copy the points array
      snapshot.set(key, points.map(p => ({ x: p.x, y: p.y })));
    });
    setFrozenTokenPaths(snapshot);
  }, [animationKey, tokenPaths]);

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
  const handleReplay = () => {
    setAnimationKey(prev => prev + 1);
  };

  // Handle provider modal
  const handleProviderClick = (pspName: string) => {
    setModalProvider(pspName);
  };

  const handleSelectProvider = (provider: string) => {
    setModalProvider(null);
    if (onProviderSelect) {
      onProviderSelect(provider);
    }
    setAnimationKey(prev => prev + 1);
  };

  // If we have no visible providers, show empty state
  if (!visibleProviders || visibleProviders.length === 0) {
    return (
      <div 
        className={`relative w-full rounded-xl border overflow-hidden flex items-center justify-center ${
          glassTheme ? 'backdrop-blur-xl bg-gray-950/80' : 'bg-gray-50 border-gray-200'
        }`}
        style={{ 
          height: `${height}px`,
          ...(glassTheme && { borderColor: 'var(--glass-border)' })
        }}
      >
        <div className="text-center" style={glassTheme ? { color: 'var(--color-silver-mist-dim)' } : { color: '#9CA3AF' }}>
          <Store className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No routing providers available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full rounded-xl border overflow-hidden ${
        glassTheme ? 'backdrop-blur-xl bg-gray-950/80' : 'bg-gray-50 border-gray-200'
      }`} 
      style={{ 
        height: `${height}px`,
        ...(glassTheme && { borderColor: 'var(--glass-border)' })
      }}
    >
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className={`w-10 h-10 border rounded-lg shadow-sm transition-colors flex items-center justify-center ${
            glassTheme ? 'backdrop-blur-md bg-white/[0.05] hover:bg-white/[0.08]' : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
          style={glassTheme ? { borderColor: 'var(--glass-border)', color: 'var(--color-silver-mist)' } : {}}
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className={`w-10 h-10 border rounded-lg shadow-sm transition-colors flex items-center justify-center ${
            glassTheme ? 'backdrop-blur-md bg-white/[0.05] hover:bg-white/[0.08]' : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
          style={glassTheme ? { borderColor: 'var(--glass-border)', color: 'var(--color-silver-mist)' } : {}}
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleResetZoom}
          className={`w-10 h-10 border rounded-lg shadow-sm transition-colors flex items-center justify-center ${
            glassTheme ? 'backdrop-blur-md bg-white/[0.05] hover:bg-white/[0.08]' : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
          style={glassTheme ? { borderColor: 'var(--glass-border)', color: 'var(--color-silver-mist)' } : {}}
          title="Reset View"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
        <div 
          className={`text-xs text-center px-2 py-1 rounded border ${
            glassTheme ? 'backdrop-blur-md bg-white/[0.05]' : 'bg-white border-gray-200'
          }`}
          style={glassTheme ? { borderColor: 'var(--glass-border)', color: 'var(--color-silver-mist-dim)' } : { color: '#6B7280' }}
        >
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Replay Button */}
      <div className="absolute top-4 right-20 z-20">
        <button 
          onClick={handleReplay}
          className={`px-4 py-2 border rounded-lg shadow-sm flex items-center gap-2 text-sm font-medium cursor-pointer transition-colors ${
            glassTheme ? 'backdrop-blur-md bg-white/[0.05] hover:bg-white/[0.08]' : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
          style={glassTheme ? { borderColor: 'var(--glass-border)', color: 'var(--color-silver-mist)' } : {}}
        >
          <RotateCcw className="w-4 h-4" />
          Replay
        </button>
      </div>

      {/* Canvas */}
      <div ref={canvasRef} className="absolute inset-0 overflow-hidden">
        <div
          ref={contentRef}
          className="absolute inset-0"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'center center',
            transition: 'transform 0.1s ease-out',
            willChange: 'transform'
          }}
        >
          {/* SVG Layer for Paths */}
          <svg className="absolute inset-0 pointer-events-none z-[1]" style={{ width: '100%', height: '100%' }}>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              {/* Gradient for merchant to Revelius (blue to black) */}
              <linearGradient id="gradient-merchant-revelius" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                <stop offset="100%" stopColor="#000000" stopOpacity="1" />
              </linearGradient>
              
              {/* Gradients for each PSP */}
              {visibleProviders.map(pspName => {
                const color = pspConfig[pspName]?.color || '#9CA3AF';
                return (
                  <linearGradient key={`gradient-${pspName}`} id={`gradient-${pspName}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#000000" stopOpacity="1" />
                    <stop offset="100%" stopColor={color} stopOpacity="1" />
                  </linearGradient>
                );
              })}
            </defs>
            
            {/* Merchant to Revelius */}
            {merchantPath && (
              <>
                {/* Base dashed line */}
                <motion.path
                  key={`merchant-revelius-${animationKey}`}
                  d={merchantPath}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  opacity={0.5}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{ 
                    pathLength: { duration: 0.6, delay: 0.1, ease: "easeInOut" },
                    opacity: { duration: 0.3 }
                  }}
                />
                {/* Animated pulse traveling along the line */}
                <motion.path
                  key={`merchant-revelius-pulse-${animationKey}`}
                  d={merchantPath}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  strokeDasharray="30 200"
                  strokeLinecap="round"
                  opacity={1}
                  filter="url(#glow)"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: -230 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.8
                  }}
                />
              </>
            )}
            
            {/* Revelius to PSPs */}
            {paths.map((path) => {
              const route = routingModel.find(r => r.pspName === path.pspName);
              const isActive = route && route.count > 0;
              const isHovered = hoveredPsp === path.pspName;
              const isSelectedProvider = activeSelectedProvider === path.pspName;
              const isDimmed = (hoveredPsp && !isHovered) || (activeSelectedProvider && !isSelectedProvider);
              
              const reveliusOut = portsById.get("revelius:out");
              const pspIn = portsById.get(`psp:${path.pspName}:in`);

              const strokeWidth = 2;
              const strokeOpacity = isActive ? 0.9 : 0.3;

              return (
                <g key={`${path.pspName}-${animationKey}`}>
                  <motion.path
                    d={path.d}
                    fill="none"
                    stroke={path.color || '#9CA3AF'}
                    strokeWidth={strokeWidth}
                    strokeDasharray="none"
                    opacity={strokeOpacity}
                    filter="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: 1, 
                      opacity: strokeOpacity
                    }}
                    transition={{ 
                      pathLength: { duration: 0.8, delay: 0.3, ease: "easeInOut" },
                      opacity: { duration: 0.3 }
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Nodes Layer */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Transaction/Merchant Node - Icon centered at 50% */}
            <div
              className="absolute z-10"
              style={{
                left: `${layout.merchantX}px`,
                top: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <div className="flex flex-col items-center" style={{ transform: 'translateY(-32px)' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg relative">
                {transactionId ? (
                  <span className="text-white font-bold text-2xl">💳</span>
                ) : (
                  <Store className="w-8 h-8 text-white" />
                )}
                <div
                  ref={registerPortRef("merchant:out")}
                  data-port="merchant:out"
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 opacity-0 pointer-events-none"
                />
              </div>
              
              {transactionId ? (
                // Transaction context - show transaction details
                <div className="mt-2 flex flex-col items-center">
                  <div className={`text-xs font-semibold font-mono ${glassTheme ? 'text-white' : 'text-gray-900'}`}>
                    {transactionId}
                  </div>
                  {transactionAmount !== undefined && transactionCurrency && (
                    <div className={`text-sm font-bold mt-1 ${glassTheme ? 'text-white' : 'text-gray-900'}`}>
                      {transactionCurrency} {transactionAmount.toFixed(2)}
                    </div>
                  )}
                  {itemCount !== undefined && itemCount > 0 && (
                    <div className={`text-xs mt-0.5 ${glassTheme ? 'text-gray-300' : 'text-gray-500'}`}>
                      {itemCount} item{itemCount !== 1 ? 's' : ''}
                    </div>
                  )}
                  <div className={`text-xs mt-0.5 max-w-[100px] text-center truncate ${glassTheme ? 'text-gray-300' : 'text-gray-500'}`}>
                    {merchantName}
                  </div>
                </div>
              ) : (
                // Merchant context - show merchant details
                <>
                  <div className={`mt-2 text-sm font-medium max-w-[100px] text-center truncate ${glassTheme ? 'text-white' : 'text-gray-900'}`}>
                    {merchantName}
                  </div>
                  {merchantCountry && (
                    <div className={`text-xs mt-1 ${glassTheme ? 'text-gray-300' : 'text-gray-500'}`}>
                      {merchantCountry}
                    </div>
                  )}
                </>
              )}
              </div>
            </div>

            {/* Revelius Node - Icon centered at 50% */}
            <div
              className="absolute z-10"
              style={{
                left: `${layout.reveliusX}px`,
                top: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <div className="flex flex-col items-center" style={{ transform: 'translateY(-48px)' }}>
              <div className="relative flex items-center justify-center">
                {/* Ripple Effects - fixed size, perfectly centered */}
                <div className="absolute w-24 h-24 flex items-center justify-center pointer-events-none">
                  <motion.div
                    className="absolute rounded-full border-2 border-gray-400"
                    style={{ width: '96px', height: '96px' }}
                    animate={{
                      scale: [0.95, 2.2],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeOut",
                      times: [0, 0.1, 1]
                    }}
                  />
                </div>
                <div className="absolute w-24 h-24 flex items-center justify-center pointer-events-none">
                  <motion.div
                    className="absolute rounded-full border-2 border-gray-400"
                    style={{ width: '96px', height: '96px' }}
                    animate={{
                      scale: [0.95, 2.2],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 1,
                      times: [0, 0.1, 1]
                    }}
                  />
                </div>
                <div className="absolute w-24 h-24 flex items-center justify-center pointer-events-none">
                  <motion.div
                    className="absolute rounded-full border-2 border-gray-400"
                    style={{ width: '96px', height: '96px' }}
                    animate={{
                      scale: [0.95, 2.2],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 2,
                      times: [0, 0.1, 1]
                    }}
                  />
                </div>
                
                <div className="relative w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center shadow-2xl z-10">
                  <Zap className="w-12 h-12 text-white" />
                  <div
                    ref={registerPortRef("revelius:in")}
                    data-port="revelius:in"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 opacity-0 pointer-events-none"
                  />
                  <div
                    ref={registerPortRef("revelius:out")}
                    data-port="revelius:out"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 opacity-0 pointer-events-none"
                  />
                </div>
              </div>
              <div className={`mt-2 text-sm font-bold ${glassTheme ? 'text-white' : 'text-gray-900'}`}>
                Revelius
              </div>
              {skus.length > 0 && (
                <div className={`text-xs mt-1 ${glassTheme ? 'text-gray-300' : 'text-gray-500'}`}>
                  {skus.length} items routing
                </div>
              )}
              </div>
            </div>

            {/* PSP Stack (Vertical) - Entire stack centered at 50% */}
            <div
              className="absolute flex flex-col gap-3 z-20"
              style={{
                left: `${layout.pspStartX}px`,
                top: '50%',
                transform: 'translateY(-50%)', // Centers the entire stack as a box
              }}
            >
              {visibleProviders.map((pspName) => {
                const config = pspConfig[pspName];
                const route = routingModel.find(r => r.pspName === pspName);
                const status = route?.status || 'Approved';
                const count = route?.count || 0;
                const isActive = count > 0;
                
                // In merchant mode, highlight all active providers
                // In transaction mode, only highlight the selected one
                const isHighlighted = mode === 'merchant' 
                  ? isActive 
                  : activeSelectedProvider === pspName;
                
                const StatusIcon = status === 'Approved' ? CheckCircle :
                  status === 'Review' ? AlertTriangle : XCircle;
                
                // Styling based on whether provider is highlighted
                const pspBrandColor = config?.color || '#9CA3AF';
                const borderColor = mode === 'merchant'
                  ? (isActive ? pspBrandColor : '#e5e7eb') // Use brand color in merchant mode when active
                  : (isHighlighted ? '#10b981' : '#e5e7eb'); // Use emerald for selected in transaction mode
                
                const borderWidth = (mode === 'merchant' && isActive) || (mode !== 'merchant' && isHighlighted) ? '3px' : '2px';
                
                const bgColorStyle = mode === 'merchant'
                  ? (isActive 
                      ? (glassTheme ? `${pspBrandColor}30` : `${pspBrandColor}08`) 
                      : (glassTheme ? 'rgba(255, 255, 255, 0.08)' : '#f9fafb')
                    )
                  : (isHighlighted 
                      ? (glassTheme ? 'rgba(16, 185, 129, 0.3)' : '#ecfdf5')
                      : (glassTheme ? 'rgba(255, 255, 255, 0.08)' : '#f9fafb')
                    );
                
                const iconColor = status === 'Approved' ? 'text-green-500' :
                  status === 'Review' ? 'text-amber-500' : 'text-red-500';

                return (
                  <div
                    key={pspName}
                    onClick={() => handleProviderClick(pspName)}
                    onMouseEnter={() => setHoveredPsp(pspName)}
                    onMouseLeave={() => setHoveredPsp(null)}
                    className={`relative w-[220px] h-[52px] rounded-xl flex items-center gap-3 px-3 transition-all pointer-events-auto cursor-pointer ${
                      !isActive ? 'opacity-40' : 'opacity-100'
                    } ${glassTheme ? '' : 'shadow-md hover:shadow-lg'}`}
                    style={{ 
                      borderColor, 
                      borderWidth,
                      borderStyle: 'solid',
                      backgroundColor: bgColorStyle,
                      backdropFilter: glassTheme ? 'blur(12px) saturate(180%)' : undefined,
                      WebkitBackdropFilter: glassTheme ? 'blur(12px) saturate(180%)' : undefined,
                    }}
                  >
                    <div
                      ref={registerPortRef(`psp:${pspName}:in`)}
                      data-port={`psp:${pspName}:in`}
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 opacity-0 pointer-events-none"
                    />
                    
                    <div
                      className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex-shrink-0 flex items-center justify-center shadow-sm"
                    >
                      <PaymentProviderLogo
                        provider={{ key: pspName, name: getProviderDisplayName(pspName) }}
                        size={28}
                        className="object-contain"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold truncate ${
                        glassTheme 
                          ? (isActive ? 'text-white' : 'text-gray-400')
                          : (isActive ? 'text-gray-900' : 'text-gray-400')
                      }`}>
                        {getProviderDisplayName(pspName)}
                      </div>
                      {isActive && (
                        <div className={`text-xs ${glassTheme ? 'text-gray-300' : 'text-gray-500'}`}>
                          {count} item{count !== 1 ? 's' : ''}
                        </div>
                      )}
                      {!isActive && (
                        <div className="text-xs text-gray-400">
                          Not selected
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {hasMoreProviders && (
                <div className="w-[220px] h-[52px] rounded-xl bg-gray-100 border-2 border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors pointer-events-auto opacity-40">
                  <span className="text-sm font-semibold text-gray-500">
                    +{Object.keys(pspConfig).length - MAX_VISIBLE_PROVIDERS} More
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Provider Route Modal */}
      {modalProvider && modalCoverage && (
        <ProviderRouteModal
          open={!!modalProvider}
          onOpenChange={(open) => !open && setModalProvider(null)}
          provider={modalProvider}
          coverage={modalCoverage}
          items={skus}
          onSelect={() => handleSelectProvider(modalProvider)}
        />
      )}
    </div>
  );
}
