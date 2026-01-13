import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Store, Zap, Search, AlertCircle, CheckCircle, AlertTriangle, XCircle, RotateCcw, ShoppingBag, GraduationCap, Users, Video, Pill, Package, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface CartItem {
  sku: string;
  title: string;
  type: 'electronics' | 'tobacco' | 'nicotine' | 'ugc-content' | 'subscription' | 'course' | 'supplement' | 'health-claim' | 'apparel' | 'digital-goods';
  price: number;
  signals: string[];
}

interface MockTransaction {
  id: string;
  merchantName: string;
  country: string;
  currency: string;
  amount: number;
  risk: 'Low' | 'Medium' | 'High';
  category: string;
  items: CartItem[];
}

interface RouteDecision {
  pspName: PSPName;
  status: 'Approved' | 'Review' | 'Blocked';
  count: number;
  reasons: string[];
}

interface TokenAssignment {
  itemId: string;
  pspName: PSPName;
  type: CartItem['type'];
  title: string;
  signals: string[];
  speedMs: number;
  offsetSeconds: number;
}

interface Point {
  x: number;
  y: number;
}

// Port system types
type PortId = string; // Simplified to avoid template literal issues

interface Port {
  id: PortId;
  x: number;
  y: number;
}

// PSP configuration
const PSP_CONFIG = {
  Stripe: { color: '#635BFF', logo: 'https://cdn.brandfetch.io/stripe.com/w/400/h/400/theme/dark/icon.jpeg?t=1734242558418' },
  Adyen: { color: '#0ABF53', logo: 'https://cdn.brandfetch.io/adyen.com/w/400/h/400/theme/dark/icon.jpeg?t=1734242558418' },
  Fiserv: { color: '#FF6600', logo: 'https://cdn.brandfetch.io/fiserv.com/w/400/h/400/theme/dark/icon.jpeg?t=1734242558418' },
  Checkout: { color: '#6C5CE7', logo: 'https://cdn.brandfetch.io/checkout.com/w/400/h/400/theme/dark/icon.jpeg?t=1734242558418' },
  Worldpay: { color: '#D62828', logo: 'https://logo.clearbit.com/worldpay.com' }
};

type PSPName = keyof typeof PSP_CONFIG;

// Helper: Sample points along cubic bezier curve
function cubicBezierPoint(t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
  const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;

  return { x, y };
}

// Helper: Get icon for item type
function getIconForType(type: CartItem['type']) {
  switch (type) {
    case 'tobacco':
    case 'nicotine':
    case 'supplement':
    case 'health-claim':
      return Pill;
    case 'ugc-content':
    case 'subscription':
      return Users;
    case 'course':
      return GraduationCap;
    case 'digital-goods':
      return Video;
    case 'apparel':
      return ShoppingBag;
    default:
      return Package;
  }
}

// Rich Mock Transactions (10 transactions, 5-10 items each)
const MOCK_TRANSACTIONS: MockTransaction[] = [
  // 1. Ecommerce - Electronics
  {
    id: 'tx-001',
    merchantName: 'TechWorld Store',
    country: 'US',
    currency: 'USD',
    amount: 1247.93,
    risk: 'Low',
    category: 'Electronics',
    items: [
      { sku: 'TECH-001', title: 'Wireless Headphones', type: 'electronics', price: 199.99, signals: ['low-risk', 'popular-item'] },
      { sku: 'TECH-002', title: 'USB-C Cable 2m', type: 'electronics', price: 24.99, signals: ['low-risk', 'accessory'] },
      { sku: 'TECH-003', title: 'Phone Case Premium', type: 'electronics', price: 39.99, signals: ['low-risk'] },
      { sku: 'TECH-004', title: 'Screen Protector Pack', type: 'electronics', price: 19.99, signals: ['low-risk'] },
      { sku: 'TECH-005', title: 'Portable Charger 20000mAh', type: 'electronics', price: 54.99, signals: ['low-risk'] },
      { sku: 'TECH-006', title: 'Laptop Stand Aluminum', type: 'electronics', price: 79.99, signals: ['low-risk'] },
      { sku: 'TECH-007', title: 'Wireless Mouse', type: 'electronics', price: 34.99, signals: ['low-risk'] },
      { sku: 'TECH-008', title: 'Keyboard Mechanical RGB', type: 'electronics', price: 129.99, signals: ['low-risk', 'popular-item'] },
      { sku: 'TECH-009', title: 'Webcam HD 1080p', type: 'electronics', price: 89.99, signals: ['low-risk'] },
      { sku: 'TECH-010', title: 'Monitor Light Bar', type: 'electronics', price: 573.02, signals: ['low-risk'] }
    ]
  },

  // 2. Ecommerce - Apparel
  {
    id: 'tx-002',
    merchantName: 'Urban Fashion Co',
    country: 'UK',
    currency: 'GBP',
    amount: 385.50,
    risk: 'Low',
    category: 'Apparel',
    items: [
      { sku: 'CLT-001', title: 'Cotton T-Shirt Black', type: 'apparel', price: 29.99, signals: ['low-risk', 'clothing'] },
      { sku: 'CLT-002', title: 'Denim Jeans Slim Fit', type: 'apparel', price: 79.99, signals: ['low-risk', 'clothing'] },
      { sku: 'CLT-003', title: 'Hoodie Premium Grey', type: 'apparel', price: 69.99, signals: ['low-risk', 'clothing'] },
      { sku: 'CLT-004', title: 'Sneakers Limited Edition', type: 'apparel', price: 149.99, signals: ['low-risk', 'footwear'] },
      { sku: 'CLT-005', title: 'Baseball Cap Embroidered', type: 'apparel', price: 34.99, signals: ['low-risk', 'accessory'] },
      { sku: 'CLT-006', title: 'Socks Pack of 5', type: 'apparel', price: 20.55, signals: ['low-risk'] }
    ]
  },

  // 3. Tobacco/Nicotine - Vape Shop
  {
    id: 'tx-003',
    merchantName: 'VapeWorld Pro',
    country: 'US',
    currency: 'USD',
    amount: 289.95,
    risk: 'High',
    category: 'Tobacco',
    items: [
      { sku: 'VPE-001', title: 'Vape Starter Kit', type: 'tobacco', price: 89.99, signals: ['age-restricted', 'tobacco', 'high-risk'] },
      { sku: 'VPE-002', title: 'E-Liquid Strawberry 60ml', type: 'nicotine', price: 24.99, signals: ['age-restricted', 'nicotine', 'high-risk'] },
      { sku: 'VPE-003', title: 'E-Liquid Mint 60ml', type: 'nicotine', price: 24.99, signals: ['age-restricted', 'nicotine', 'high-risk'] },
      { sku: 'VPE-004', title: 'Replacement Coils Pack', type: 'tobacco', price: 19.99, signals: ['age-restricted', 'tobacco'] },
      { sku: 'VPE-005', title: 'Vape Tank Pyrex', type: 'tobacco', price: 34.99, signals: ['age-restricted', 'tobacco'] },
      { sku: 'VPE-006', title: 'Battery 18650 Pack', type: 'electronics', price: 29.99, signals: ['low-risk', 'accessory'] },
      { sku: 'VPE-007', title: 'Drip Tips Set', type: 'tobacco', price: 14.99, signals: ['age-restricted'] },
      { sku: 'VPE-008', title: 'Carrying Case Premium', type: 'electronics', price: 50.02, signals: ['low-risk'] }
    ]
  },

  // 4. Tobacco/Nicotine - Smoke Shop
  {
    id: 'tx-004',
    merchantName: 'Premium Smoke Co',
    country: 'CA',
    currency: 'CAD',
    amount: 467.88,
    risk: 'High',
    category: 'Tobacco',
    items: [
      { sku: 'SMK-001', title: 'Premium Cigars Box 20pc', type: 'tobacco', price: 199.99, signals: ['age-restricted', 'tobacco', 'high-risk', 'luxury'] },
      { sku: 'SMK-002', title: 'Cigar Humidor Cedar', type: 'electronics', price: 149.99, signals: ['low-risk', 'accessory'] },
      { sku: 'SMK-003', title: 'Lighter Butane Torch', type: 'electronics', price: 39.99, signals: ['age-restricted'] },
      { sku: 'SMK-004', title: 'Cigar Cutter Stainless', type: 'electronics', price: 29.99, signals: ['age-restricted'] },
      { sku: 'SMK-005', title: 'Pipe Tobacco Blend 50g', type: 'tobacco', price: 24.99, signals: ['age-restricted', 'tobacco', 'high-risk'] },
      { sku: 'SMK-006', title: 'Rolling Papers Premium', type: 'tobacco', price: 4.99, signals: ['age-restricted', 'tobacco'] },
      { sku: 'SMK-007', title: 'Ashtray Crystal', type: 'electronics', price: 17.94, signals: ['low-risk'] }
    ]
  },

  // 5. UGC Subscription - Content Platform
  {
    id: 'tx-005',
    merchantName: 'CreatorHub',
    country: 'US',
    currency: 'USD',
    amount: 124.97,
    risk: 'Medium',
    category: 'UGC',
    items: [
      { sku: 'UGC-001', title: 'Premium Membership 1 Month', type: 'subscription', price: 19.99, signals: ['subscription', 'ugc', 'recurring'] },
      { sku: 'UGC-002', title: 'Creator Tips (x5)', type: 'ugc-content', price: 25.00, signals: ['ugc', 'user-generated', 'tips'] },
      { sku: 'UGC-003', title: 'Exclusive Content Access', type: 'ugc-content', price: 29.99, signals: ['ugc', 'user-generated', 'adult-adjacent'] },
      { sku: 'UGC-004', title: 'Private Message Bundle', type: 'ugc-content', price: 14.99, signals: ['ugc', 'communication'] },
      { sku: 'UGC-005', title: 'Custom Video Request', type: 'ugc-content', price: 35.00, signals: ['ugc', 'user-generated', 'custom-content'] }
    ]
  },

  // 6. UGC Subscription - Social Platform
  {
    id: 'tx-006',
    merchantName: 'FanConnect',
    country: 'UK',
    currency: 'GBP',
    amount: 215.94,
    risk: 'Medium',
    category: 'UGC',
    items: [
      { sku: 'FAN-001', title: 'VIP Tier Subscription', type: 'subscription', price: 49.99, signals: ['subscription', 'ugc', 'recurring'] },
      { sku: 'FAN-002', title: 'Support Tips (x10)', type: 'ugc-content', price: 50.00, signals: ['ugc', 'tips'] },
      { sku: 'FAN-003', title: 'Behind Scenes Content', type: 'ugc-content', price: 19.99, signals: ['ugc', 'user-generated'] },
      { sku: 'FAN-004', title: 'Shoutout Video', type: 'ugc-content', price: 39.99, signals: ['ugc', 'user-generated', 'custom-content'] },
      { sku: 'FAN-005', title: 'Monthly Content Pack', type: 'ugc-content', price: 29.99, signals: ['ugc', 'user-generated'] },
      { sku: 'FAN-006', title: 'Priority DM Access', type: 'ugc-content', price: 25.98, signals: ['ugc', 'communication'] }
    ]
  },

  // 7. Online Course - Programming
  {
    id: 'tx-007',
    merchantName: 'CodeAcademy Plus',
    country: 'US',
    currency: 'USD',
    amount: 447.00,
    risk: 'Low',
    category: 'Education',
    items: [
      { sku: 'CRS-001', title: 'Full Stack Web Development', type: 'course', price: 199.00, signals: ['education', 'course', 'digital'] },
      { sku: 'CRS-002', title: 'React Masterclass', type: 'course', price: 99.00, signals: ['education', 'course', 'digital'] },
      { sku: 'CRS-003', title: 'Node.js Advanced', type: 'course', price: 89.00, signals: ['education', 'course', 'digital'] },
      { sku: 'CRS-004', title: 'Database Design Pro', type: 'course', price: 60.00, signals: ['education', 'course', 'digital'] }
    ]
  },

  // 8. Online Course with Claims - Health/Wellness
  {
    id: 'tx-008',
    merchantName: 'WellnessU Academy',
    country: 'AU',
    currency: 'AUD',
    amount: 697.00,
    risk: 'Medium',
    category: 'Health Education',
    items: [
      { sku: 'WLC-001', title: 'Lose 30 Pounds in 30 Days', type: 'course', price: 197.00, signals: ['education', 'health-claim', 'weight-loss'] },
      { sku: 'WLC-002', title: 'Natural Healing Certification', type: 'course', price: 247.00, signals: ['education', 'health-claim', 'alternative-medicine'] },
      { sku: 'WLC-003', title: 'Detox & Cleanse Program', type: 'course', price: 97.00, signals: ['education', 'health-claim', 'detox'] },
      { sku: 'WLC-004', title: 'Immune Boosting Secrets', type: 'course', price: 87.00, signals: ['education', 'health-claim'] },
      { sku: 'WLC-005', title: 'Anti-Aging Blueprint', type: 'course', price: 69.00, signals: ['education', 'health-claim', 'anti-aging'] }
    ]
  },

  // 9. Supplements with Claims
  {
    id: 'tx-009',
    merchantName: 'VitalLife Supplements',
    country: 'US',
    currency: 'USD',
    amount: 389.94,
    risk: 'High',
    category: 'Supplements',
    items: [
      { sku: 'SUP-001', title: 'Miracle Weight Loss Pills', type: 'supplement', price: 79.99, signals: ['supplement', 'health-claim', 'weight-loss', 'high-risk'] },
      { sku: 'SUP-002', title: 'Brain Enhancement Nootropic', type: 'supplement', price: 89.99, signals: ['supplement', 'health-claim', 'cognitive', 'high-risk'] },
      { sku: 'SUP-003', title: 'Testosterone Booster Max', type: 'supplement', price: 69.99, signals: ['supplement', 'health-claim', 'hormone', 'high-risk'] },
      { sku: 'SUP-004', title: 'Detox Cleanse 30 Day', type: 'supplement', price: 59.99, signals: ['supplement', 'health-claim', 'detox'] },
      { sku: 'SUP-005', title: 'Joint Pain Relief Formula', type: 'supplement', price: 49.99, signals: ['supplement', 'health-claim', 'pain-relief'] },
      { sku: 'SUP-006', title: 'Vitamin D3 High Potency', type: 'supplement', price: 39.99, signals: ['supplement', 'low-risk'] }
    ]
  },

  // 10. Marketplace - Mixed Listings
  {
    id: 'tx-010',
    merchantName: 'Global Marketplace LLC',
    country: 'NL',
    currency: 'EUR',
    amount: 856.45,
    risk: 'Medium',
    category: 'Marketplace',
    items: [
      { sku: 'MKT-001', title: 'Vintage Watch Collection', type: 'electronics', price: 299.99, signals: ['luxury', 'collectible', 'high-value'] },
      { sku: 'MKT-002', title: 'Handmade Jewelry Set', type: 'apparel', price: 129.99, signals: ['handmade', 'jewelry'] },
      { sku: 'MKT-003', title: 'Essential Oil Blend (Claims)', type: 'health-claim', price: 49.99, signals: ['health-claim', 'alternative-medicine'] },
      { sku: 'MKT-004', title: 'Rare Book First Edition', type: 'digital-goods', price: 189.99, signals: ['collectible', 'rare'] },
      { sku: 'MKT-005', title: 'Art Print Limited', type: 'digital-goods', price: 79.99, signals: ['art', 'limited-edition'] },
      { sku: 'MKT-006', title: 'Gaming Console Used', type: 'electronics', price: 106.50, signals: ['electronics', 'used', 'high-value'] }
    ]
  }
];

// Deterministic Routing Logic
function buildRoutingModel(tx: MockTransaction): { routes: RouteDecision[], tokens: TokenAssignment[] } {
  const routes: Map<PSPName, { items: CartItem[], reasons: Set<string> }> = new Map();
  
  // Initialize all PSPs
  const allPSPs: PSPName[] = ['Stripe', 'Adyen', 'Fiserv', 'Checkout', 'Worldpay'];
  allPSPs.forEach(psp => routes.set(psp, { items: [], reasons: new Set() }));

  // Route each item based on signals
  tx.items.forEach(item => {
    const signals = item.signals;
    let targetPSP: PSPName;

    if (signals.includes('tobacco') || signals.includes('nicotine')) {
      // Tobacco items: distribute across specialized PSPs
      targetPSP = signals.includes('high-risk') ? 'Fiserv' : 'Adyen';
    } else if (signals.includes('ugc') || signals.includes('user-generated')) {
      // UGC content: route to Checkout or Worldpay
      targetPSP = signals.includes('adult-adjacent') ? 'Checkout' : 'Worldpay';
    } else if (signals.includes('health-claim') || item.type === 'health-claim') {
      // Health claims: route to Fiserv (review)
      targetPSP = 'Fiserv';
    } else if (signals.includes('supplement')) {
      // Supplements: distribute based on risk
      targetPSP = signals.includes('high-risk') ? 'Fiserv' : 'Adyen';
    } else if (signals.includes('subscription')) {
      // Subscriptions: Stripe or Checkout
      targetPSP = 'Stripe';
    } else {
      // Low risk items: Stripe default
      targetPSP = 'Stripe';
    }

    const route = routes.get(targetPSP)!;
    route.items.push(item);
    signals.forEach(s => route.reasons.add(s));
  });

  // Build decision array with status determination
  const decisions: RouteDecision[] = [];
  const tokenAssignments: TokenAssignment[] = [];

  routes.forEach((routeData, pspName) => {
    if (routeData.items.length === 0) return;

    const items = routeData.items;
    const reasons = Array.from(routeData.reasons);
    let status: 'Approved' | 'Review' | 'Blocked' = 'Approved';

    // Determine status based on signals
    const hasHighRisk = reasons.some(r => r.includes('high-risk'));
    const hasTobacco = reasons.some(r => r === 'tobacco' || r === 'nicotine');
    const hasHealthClaim = reasons.some(r => r === 'health-claim');
    const hasUGC = reasons.some(r => r === 'ugc' || r === 'user-generated');
    const hasAdultAdjacent = reasons.some(r => r === 'adult-adjacent');

    if (pspName === 'Fiserv') {
      // Fiserv: mostly review or blocked for tobacco/claims
      if (hasTobacco && hasHighRisk) {
        status = 'Blocked';
      } else if (hasHealthClaim || hasTobacco) {
        status = 'Review';
      }
    } else if (pspName === 'Adyen') {
      // Adyen: handles some tobacco (review), others approved
      if (hasTobacco || hasHealthClaim) {
        status = 'Review';
      }
    } else if (pspName === 'Checkout') {
      // Checkout: UGC review if adult-adjacent
      if (hasAdultAdjacent) {
        status = 'Review';
      }
    } else if (pspName === 'Worldpay') {
      // Worldpay: UGC mostly approved, some review
      if (hasUGC && hasHighRisk) {
        status = 'Review';
      }
    }

    decisions.push({
      pspName,
      status,
      count: items.length,
      reasons
    });

    // Create token assignments for this PSP (max 8 tokens total across all PSPs)
    // Prioritize items with more signals
    const sortedItems = [...items].sort((a, b) => b.signals.length - a.signals.length);
    
    sortedItems.forEach((item, idx) => {
      tokenAssignments.push({
        itemId: `${item.sku}-${pspName}`,
        pspName,
        type: item.type,
        title: item.title,
        signals: item.signals,
        speedMs: 2000 + Math.random() * 1000, // 2-3 seconds
        offsetSeconds: idx * 0.3 // Stagger tokens
      });
    });
  });

  // Limit to 8 tokens max
  const limitedTokens = tokenAssignments.slice(0, 8);

  return { routes: decisions, tokens: limitedTokens };
}

// Transaction List Component
interface TransactionListProps {
  transactions: MockTransaction[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

function TransactionList({ transactions, selectedId, onSelect, searchQuery, onSearchChange }: TransactionListProps) {
  const filteredTxs = transactions.filter(tx =>
    tx.merchantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-[280px] max-w-[320px] bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Transactions</h2>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search merchants..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto">
        {filteredTxs.map(tx => (
          <button
            key={tx.id}
            onClick={() => onSelect(tx.id)}
            className={`w-full text-left p-3 border-b border-gray-100 transition-colors ${
              selectedId === tx.id
                ? 'bg-blue-50 border-l-2 border-l-blue-500'
                : 'hover:bg-gray-50'
            }`}
          >
            {/* Merchant + Amount */}
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm text-gray-900 truncate flex-1 pr-2">
                {tx.merchantName}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {tx.currency} {tx.amount}
              </span>
            </div>

            {/* Country */}
            <div className="text-xs text-gray-500 mb-2">{tx.country}</div>

            {/* Pills Row */}
            <div className="flex items-center gap-2 mb-1">
              {/* Risk Pill */}
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                tx.risk === 'High' ? 'bg-red-100 text-red-700' :
                tx.risk === 'Medium' ? 'bg-amber-100 text-amber-700' :
                'bg-green-100 text-green-700'
              }`}>
                {tx.risk === 'High' ? <AlertCircle className="w-3 h-3" /> :
                 tx.risk === 'Medium' ? <AlertTriangle className="w-3 h-3" /> :
                 <CheckCircle className="w-3 h-3" />}
                {tx.risk}
              </span>

              {/* Category Pill */}
              <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                {tx.category}
              </span>
            </div>

            {/* Items Count */}
            <div className="text-xs text-gray-500">
              Items: {tx.items.length}
            </div>
          </button>
        ))}

        {filteredTxs.length === 0 && (
          <div className="p-4 text-center text-sm text-gray-500">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
}

// Port Management Hook
function usePorts(canvasRef: React.RefObject<HTMLDivElement>) {
  const [portsById, setPortsById] = useState<Map<PortId, Port>>(new Map());
  const portRefsMap = useRef<Map<PortId, HTMLElement>>(new Map());
  const computeTimeoutRef = useRef<number | null>(null);

  // Register a port element
  const registerPortRef = useCallback((portId: PortId) => {
    return (element: HTMLElement | null) => {
      if (element) {
        portRefsMap.current.set(portId, element);
      } else {
        portRefsMap.current.delete(portId);
      }
    };
  }, []);

  // Compute port positions from DOM
  const computePorts = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newPorts = new Map<PortId, Port>();

    portRefsMap.current.forEach((element, portId) => {
      const rect = element.getBoundingClientRect();
      
      // Convert to canvas-local coordinates
      const localX = rect.left - canvasRect.left;
      const localY = rect.top - canvasRect.top;
      
      // Compute port position based on port ID
      let x = localX;
      let y = localY + rect.height / 2; // Default: left-center
      
      if (portId.includes(':out')) {
        // Right-center for output ports
        x = localX + rect.width;
        y = localY + rect.height / 2;
      } else if (portId.includes(':in')) {
        // Left-center for input ports
        x = localX;
        y = localY + rect.height / 2;
      }
      
      newPorts.set(portId, { id: portId, x, y });
    });

    // Only update if ports actually changed (to prevent infinite loops)
    setPortsById(prevPorts => {
      // Check if maps are different
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
  }, []); // canvasRef is a ref, shouldn't be in deps

  // Debounced recompute
  const requestRecompute = useCallback(() => {
    if (computeTimeoutRef.current !== null) {
      window.clearTimeout(computeTimeoutRef.current);
    }
    computeTimeoutRef.current = window.setTimeout(() => {
      computePorts();
      computeTimeoutRef.current = null;
    }, 50);
  }, [computePorts]);

  // Set up observers
  useEffect(() => {
    if (!canvasRef.current) return;

    // Watch canvas resize
    const resizeObserver = new ResizeObserver(requestRecompute);
    resizeObserver.observe(canvasRef.current);

    // Watch window resize
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

// Routing Canvas Shell Component
interface RoutingCanvasShellProps {
  selectedTransaction: MockTransaction | null;
  routingModel: RouteDecision[];
  tokens: TokenAssignment[];
  animationKey: number;
  onReplay: () => void;
}

interface PathData {
  d: string;
  color: string;
  pspName: PSPName;
}

interface TokenPathData {
  pspName: PSPName;
  points: Point[];
}

function RoutingCanvasShell({ selectedTransaction, routingModel, tokens, animationKey, onReplay }: RoutingCanvasShellProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const merchantRef = useRef<HTMLDivElement>(null);
  const reveliusRef = useRef<HTMLDivElement>(null);
  const pspRowRefs = useRef<Map<PSPName, HTMLDivElement>>(new Map());
  
  // Port system
  const { registerPortRef, portsById, recomputePorts } = usePorts(canvasRef);
  
  const [paths, setPaths] = useState<PathData[]>([]);
  const [tokenPaths, setTokenPaths] = useState<Map<PSPName, Point[]>>(new Map());
  const [merchantPath, setMerchantPath] = useState<string>('');
  const [hoveredPsp, setHoveredPsp] = useState<PSPName | null>(null);
  
  // Pan and Zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Layout calculation state
  const [layout, setLayout] = useState({
    merchantX: 200,
    reveliusX: 500,
    pspStartX: 800,
    contentWidth: 1200,
    contentHeight: 400,
    scale: 1
  });

  // Calculate layout and positioning based on canvas size
  const calculateLayout = useCallback(() => {
    if (!canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const canvasWidth = canvasRect.width;
    const canvasHeight = canvasRect.height;

    // Define node dimensions and spacing (in content space pixels)
    const merchantNodeSize = 64; // w-16 = 64px
    const merchantLabelWidth = 100;
    const merchantTotalWidth = Math.max(merchantNodeSize, merchantLabelWidth);
    
    const reveliusNodeSize = 96; // w-24 = 96px
    const reveliusLabelWidth = 120;
    const reveliusTotalWidth = Math.max(reveliusNodeSize, reveliusLabelWidth);
    
    const pspWidth = 220; // PSP card width
    const pspHeight = 52;
    const pspGap = 12; // Gap between PSP cards (gap-3 = 12px)
    const pspStackHeight = (pspHeight + pspGap) * Object.keys(PSP_CONFIG).length - pspGap;
    
    // Spacing between nodes (horizontal gaps) - responsive to canvas size
    const merchantToReveliusGap = Math.max(120, canvasWidth * 0.08);
    const reveliusToPspGap = Math.max(150, canvasWidth * 0.1);
    
    // Calculate total content width needed (in content space)
    const totalContentWidth = merchantTotalWidth + merchantToReveliusGap + reveliusTotalWidth + reveliusToPspGap + pspWidth;
    const totalContentHeight = Math.max(pspStackHeight, 200);
    
    // Calculate scale to fit content with padding (15% padding on all sides)
    const padding = 0.15;
    const availableWidth = canvasWidth * (1 - padding * 2);
    const availableHeight = canvasHeight * (1 - padding * 2);
    const scaleX = availableWidth / totalContentWidth;
    const scaleY = availableHeight / totalContentHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 1
    
    // Calculate node positions in content space (absolute positions within the content container)
    // The content will be centered via transform, so we position nodes relative to content center
    const contentStartX = 0; // Start of content in content space
    const merchantX = contentStartX + merchantTotalWidth / 2;
    const reveliusX = contentStartX + merchantTotalWidth + merchantToReveliusGap + reveliusTotalWidth / 2;
    const pspStartX = contentStartX + merchantTotalWidth + merchantToReveliusGap + reveliusTotalWidth + reveliusToPspGap;
    
    // Center the content in the canvas by calculating offset
    // Content container is at inset-0, so we need to offset nodes to center them
    const contentCenterX = totalContentWidth / 2;
    const canvasCenterX = canvasWidth / 2;
    const offsetX = canvasCenterX - contentCenterX;
    
    setLayout({
      merchantX: merchantX + offsetX,
      reveliusX: reveliusX + offsetX,
      pspStartX: pspStartX + offsetX,
      contentWidth: totalContentWidth,
      contentHeight: totalContentHeight,
      scale
    });
  }, []);

  // Calculate paths based on port positions
  const calculatePaths = useCallback(() => {
    if (portsById.size === 0) {
      // Clear paths if no ports
      setPaths([]);
      setTokenPaths(new Map());
      setMerchantPath('');
      return;
    }

    // Get port coordinates
    const merchantOut = portsById.get("merchant:out");
    const reveliusIn = portsById.get("revelius:in");
    const reveliusOut = portsById.get("revelius:out");

    if (!merchantOut || !reveliusIn || !reveliusOut) {
      // Not all essential ports are ready yet
      return;
    }

    // Merchant to Revelius path (straight line)
    const merchantToRevelius = `M ${merchantOut.x} ${merchantOut.y} L ${reveliusIn.x} ${reveliusIn.y}`;
    setMerchantPath(merchantToRevelius);

    const newPaths: PathData[] = [];
    const newTokenPaths = new Map<PSPName, Point[]>();

    // Draw paths to ALL PSPs using port system
    Object.keys(PSP_CONFIG).forEach(pspName => {
      const pspPortId = `psp:${pspName}:in`;
      const pspPort = portsById.get(pspPortId);

      if (!pspPort) {
        return;
      }

      const startX = reveliusOut.x;
      const startY = reveliusOut.y;
      const endX = pspPort.x;
      const endY = pspPort.y;

      // Calculate cubic bezier control points for shallow fan curve
      const dx = endX - startX;
      
      const c1x = startX + dx * 0.45;
      const c1y = startY;
      
      const c2x = startX + dx * 0.70;
      const c2y = endY;

      const pathD = `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`;

      newPaths.push({
        d: pathD,
        color: PSP_CONFIG[pspName as PSPName].color,
        pspName: pspName as PSPName
      });

      // Sample points along the bezier curve for token animation (40 points)
      const points: Point[] = [];
      const p0 = { x: startX, y: startY };
      const p1 = { x: c1x, y: c1y };
      const p2 = { x: c2x, y: c2y };
      const p3 = { x: endX, y: endY };

      for (let i = 0; i <= 40; i++) {
        const t = i / 40;
        points.push(cubicBezierPoint(t, p0, p1, p2, p3));
      }

      newTokenPaths.set(pspName as PSPName, points);
    });

    setPaths(newPaths);
    setTokenPaths(newTokenPaths);
  }, [portsById]);

  // Recalculate layout, ports, and paths on mount, routing change, and resize
  useLayoutEffect(() => {
    // Calculate layout first
    calculateLayout();
    
    // Then recompute ports and paths with delay for DOM rendering
    const timer1 = setTimeout(() => {
      calculateLayout();
      recomputePorts();
      calculatePaths();
    }, 50);
    
    const timer2 = setTimeout(() => {
      calculateLayout();
      recomputePorts();
      calculatePaths();
    }, 200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [routingModel, animationKey, calculateLayout, recomputePorts, calculatePaths]);

  // Set initial zoom based on calculated scale (only on first calculation)
  useEffect(() => {
    if (layout.scale > 0 && layout.scale < 1) {
      setZoom(prev => {
        // Only set initial zoom if it's still at default (1)
        if (prev === 1) {
          return layout.scale;
        }
        return prev;
      });
    }
  }, [layout.scale]);

  // Recalculate paths when ports change
  useEffect(() => {
    // Wait for ports to be registered (need at least merchant, revelius, and one PSP)
    if (portsById.size >= 4) {
      calculatePaths();
    }
  }, [portsById, calculatePaths]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      // Delay to ensure layout is stable
      setTimeout(() => {
        calculateLayout();
        recomputePorts();
        calculatePaths();
      }, 50);
    });

    resizeObserver.observe(canvasRef.current);

    // Also listen to window resize
    const handleResize = () => {
      setTimeout(() => {
        calculateLayout();
        recomputePorts();
        calculatePaths();
      }, 50);
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [routingModel, calculateLayout, recomputePorts, calculatePaths]);

  // Pan and Zoom handlers
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 2));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click only
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetView = () => {
    // Recalculate layout first
    calculateLayout();
    // Use current layout scale, default to 1 if scale >= 1
    const targetZoom = layout.scale > 0 && layout.scale < 1 ? layout.scale : 1;
    setZoom(targetZoom);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={canvasRef}
      className="flex-1 min-w-0 relative bg-white overflow-hidden" 
      style={{
        backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 flex items-center justify-center"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 flex items-center justify-center"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleResetView}
          className="w-10 h-10 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 flex items-center justify-center"
          title="Reset View"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
        <div className="text-xs text-center text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Transformed Content Container */}
      <div
        ref={contentRef}
        className="absolute inset-0"
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          willChange: 'transform'
        }}
      >
        {/* SVG Overlay for Routes */}
        <svg 
          className="absolute inset-0 pointer-events-none z-0"
          style={{ width: '100%', height: '100%' }}
        >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Merchant to Revelius line */}
        {merchantPath && (
          <>
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
            {/* Endpoint dots for merchant line */}
            {portsById.get("merchant:out") && (
              <motion.circle
                key={`merchant-out-dot-${animationKey}`}
                cx={portsById.get("merchant:out")!.x}
                cy={portsById.get("merchant:out")!.y}
                r={3}
                fill="#94a3b8"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.6 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
            )}
            {portsById.get("revelius:in") && (
              <motion.circle
                key={`revelius-in-dot-${animationKey}`}
                cx={portsById.get("revelius:in")!.x}
                cy={portsById.get("revelius:in")!.y}
                r={3}
                fill="#94a3b8"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.6 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              />
            )}
          </>
        )}

        {/* Revelius to PSP lines */}
        {paths.map((path) => {
          const route = routingModel.find(r => r.pspName === path.pspName);
          const isActive = route && route.count > 0;
          const isHovered = hoveredPsp === path.pspName;
          const isDimmed = hoveredPsp && !isHovered;
          
          const reveliusOut = portsById.get("revelius:out");
          const pspIn = portsById.get(`psp:${path.pspName}:in`);

          return (
            <g key={`${path.pspName}-${animationKey}`}>
              <motion.path
                d={path.d}
                fill="none"
                stroke={path.color}
                strokeWidth={isHovered ? 4 : isActive ? 3 : 2}
                strokeDasharray={isActive ? 'none' : '6 4'}
                opacity={isDimmed ? 0.15 : isActive ? 0.8 : 0.3}
                filter={isActive ? "url(#glow)" : "none"}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: isDimmed ? 0.15 : isActive ? 0.8 : 0.3 
                }}
                transition={{ 
                  pathLength: { duration: 0.8, delay: 0.3, ease: "easeInOut" },
                  opacity: { duration: 0.3 }
                }}
              />
              {/* Endpoint dot at PSP input port */}
              {isActive && pspIn && (
                <motion.circle
                  cx={pspIn.x}
                  cy={pspIn.y}
                  r={isHovered ? 4 : 3}
                  fill={path.color}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: isDimmed ? 0.3 : 0.8 
                  }}
                  transition={{ duration: 0.3, delay: 1.0 }}
                />
              )}
              {/* Small dot at Revelius output port (shared by all) */}
              {isActive && reveliusOut && (
                <motion.circle
                  cx={reveliusOut.x}
                  cy={reveliusOut.y}
                  r={2}
                  fill={path.color}
                  opacity={0.4}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Replay Button */}
      <div className="absolute top-4 right-4 z-10 pointer-events-auto">
        <button 
          onClick={onReplay}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 flex items-center gap-2 text-sm font-medium cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Replay
        </button>
      </div>

      {/* Canvas Content */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Merchant Node (Left) */}
        <div 
          className="flex flex-col items-center" 
          style={{ 
            position: 'absolute', 
            left: `${layout.merchantX}px`, 
            top: '50%', 
            transform: 'translate(-50%, -50%)' 
          }}
        >
          <div 
            ref={merchantRef}
            className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg relative"
          >
            <Store className="w-8 h-8 text-white" />
            {/* Port marker: right-center */}
            <div 
              ref={registerPortRef("merchant:out")}
              data-port="merchant:out"
              className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 opacity-0 pointer-events-none"
            />
          </div>
          <div className="mt-2 text-sm font-medium text-gray-900 max-w-[100px] text-center truncate">
            {selectedTransaction?.merchantName || 'Merchant'}
          </div>
          {selectedTransaction && (
            <div className="text-xs text-gray-500 mt-1">
              {selectedTransaction.country}
            </div>
          )}
        </div>

        {/* Revelius Node (Center) */}
        <div 
          className="flex flex-col items-center" 
          style={{ 
            position: 'absolute', 
            left: `${layout.reveliusX}px`, 
            top: '50%', 
            transform: 'translate(-50%, -50%)' 
          }}
        >
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-30" />
            
            {/* Main Circle - with ref for path calculation */}
            <div 
              ref={reveliusRef}
              className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl"
            >
              <Zap className="w-12 h-12 text-white" />
              {/* Port marker: left-center (input from merchant) */}
              <div 
                ref={registerPortRef("revelius:in")}
                data-port="revelius:in"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 opacity-0 pointer-events-none"
              />
              {/* Port marker: right-center (output to PSPs) */}
              <div 
                ref={registerPortRef("revelius:out")}
                data-port="revelius:out"
                className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 opacity-0 pointer-events-none"
              />
            </div>
          </div>
          <div className="mt-2 text-sm font-bold text-gray-900">
            Revelius
          </div>
          {selectedTransaction && (
            <div className="text-xs text-gray-500 mt-1">
              {selectedTransaction.items.length} items routing
            </div>
          )}
        </div>

        {/* PSP Stack (Right) */}
        <div 
          className="flex flex-col gap-3" 
          style={{ 
            position: 'absolute', 
            left: `${layout.pspStartX}px`, 
            top: '50%', 
            transform: 'translateY(-50%)' 
          }}
        >
          {Object.entries(PSP_CONFIG).map(([pspName, config]) => {
            const route = routingModel.find(r => r.pspName === pspName);
            const status = route?.status || 'Approved';
            const count = route?.count || 0;
            const isActive = count > 0;
            
            const StatusIcon = status === 'Approved' ? CheckCircle :
              status === 'Review' ? AlertTriangle : XCircle;
            
            const borderColor = !isActive ? 'border-gray-200' :
              status === 'Approved' ? 'border-green-300' :
              status === 'Review' ? 'border-amber-400' : 'border-red-400';
            
            const iconColor = status === 'Approved' ? 'text-green-500' :
              status === 'Review' ? 'text-amber-500' : 'text-red-500';

            const bgColor = !isActive ? 'bg-gray-50' : 'bg-white';

            return (
              <div
                key={pspName}
                ref={(el) => {
                  if (el) {
                    pspRowRefs.current.set(pspName as PSPName, el);
                  } else {
                    pspRowRefs.current.delete(pspName as PSPName);
                  }
                }}
                onMouseEnter={() => isActive && setHoveredPsp(pspName as PSPName)}
                onMouseLeave={() => setHoveredPsp(null)}
                className={`relative w-[220px] h-[52px] ${bgColor} border-2 ${borderColor} rounded-xl shadow-md flex items-center gap-3 px-3 transition-all pointer-events-auto ${
                  !isActive ? 'opacity-40' : 'opacity-100'
                } ${isActive ? 'cursor-pointer hover:shadow-lg' : ''}`}
                style={{ cursor: isActive ? 'pointer' : 'default' }}
              >
                {/* Port marker: left-center of PSP pill */}
                <div 
                  ref={registerPortRef(`psp:${pspName}:in`)}
                  data-port={`psp:${pspName}:in`}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 opacity-0 pointer-events-none"
                />
                <img 
                  src={config.logo} 
                  alt={pspName} 
                  className="w-7 h-7 rounded object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-900 truncate">{pspName}</div>
                </div>
                <StatusIcon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
                {isActive && (
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {count}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Animated Tokens */}
      <div className="absolute inset-0 pointer-events-none z-5">
        <AnimatePresence mode="wait">
          {tokens.map(token => {
            const points = tokenPaths.get(token.pspName);
            if (!points || points.length === 0) return null;

            const Icon = getIconForType(token.type);
            const route = routingModel.find(r => r.pspName === token.pspName);
            const isBlocked = route?.status === 'Blocked';
            
            // Don't show tokens for blocked routes
            if (isBlocked) return null;

            const isHovered = hoveredPsp === token.pspName;
            const shouldAnimate = !hoveredPsp || isHovered;
            const isDimmed = hoveredPsp && !isHovered;

            return (
              <motion.div
                key={`${token.itemId}-${animationKey}`}
                className="absolute w-6 h-6 bg-white border-2 rounded-full shadow-md flex items-center justify-center"
                style={{
                  borderColor: PSP_CONFIG[token.pspName].color,
                  left: 0,
                  top: 0
                }}
                initial={{ 
                  x: points[0].x - 12, 
                  y: points[0].y - 12,
                  scale: 0,
                  opacity: 0
                }}
                animate={shouldAnimate ? {
                  x: points.map(p => p.x - 12),
                  y: points.map(p => p.y - 12),
                  scale: 1,
                  opacity: isDimmed ? 0.2 : 1
                } : {
                  scale: 1,
                  opacity: 0.2
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  x: { 
                    duration: token.speedMs / 1000, 
                    delay: token.offsetSeconds + 0.5,
                    ease: "linear",
                    repeat: Infinity
                  },
                  y: { 
                    duration: token.speedMs / 1000, 
                    delay: token.offsetSeconds + 0.5,
                    ease: "linear",
                    repeat: Infinity
                  },
                  scale: { duration: 0.3, delay: token.offsetSeconds },
                  opacity: { duration: 0.3 }
                }}
              >
                <Icon 
                  className="w-3 h-3" 
                  style={{ color: PSP_CONFIG[token.pspName].color }}
                />
                <title>{`${token.title}\n${token.signals.slice(0, 2).join(', ')}`}</title>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {!selectedTransaction && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="text-center text-gray-400">
            <Store className="w-16 h-16 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Select a transaction to visualize routing</p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

// Main Demo Component
export default function Demo() {
  const [selectedTxId, setSelectedTxId] = useState<string | null>(MOCK_TRANSACTIONS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [animationKey, setAnimationKey] = useState(0);

  const selectedTransaction = MOCK_TRANSACTIONS.find(tx => tx.id === selectedTxId) || null;
  const routingData = selectedTransaction ? buildRoutingModel(selectedTransaction) : { routes: [], tokens: [] };

  const handleSelectTransaction = (id: string) => {
    setSelectedTxId(id);
    setAnimationKey(prev => prev + 1);
  };

  const handleReplay = () => {
    setAnimationKey(prev => prev + 1);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <TransactionList
        transactions={MOCK_TRANSACTIONS}
        selectedId={selectedTxId}
        onSelect={handleSelectTransaction}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <RoutingCanvasShell 
        selectedTransaction={selectedTransaction}
        routingModel={routingData.routes}
        tokens={routingData.tokens}
        animationKey={animationKey}
        onReplay={handleReplay}
      />
    </div>
  );
}
