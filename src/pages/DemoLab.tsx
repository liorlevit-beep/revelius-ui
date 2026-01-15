import { useState, useRef, useEffect, useCallback } from 'react';
import { Store, Zap, CheckCircle, AlertTriangle, XCircle, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

// Types
interface Port {
  id: string;
  x: number;
  y: number;
}

interface PSPConfig {
  name: string;
  color: string;
  logo: string;
  status: 'Approved' | 'Review' | 'Blocked';
  itemCount: number;
}

// Hardcoded PSP configurations
const PSP_LIST: PSPConfig[] = [
  { name: 'Stripe', color: '#635BFF', logo: 'https://cdn.brandfetch.io/stripe.com/w/400/h/400/theme/dark/icon.jpeg?t=1734242558418', status: 'Approved', itemCount: 3 },
  { name: 'Adyen', color: '#0ABF53', logo: 'https://cdn.brandfetch.io/adyen.com/w/400/h/400/theme/dark/icon.jpeg?t=1734242558418', status: 'Review', itemCount: 2 },
  { name: 'Fiserv', color: '#FF6600', logo: 'https://cdn.brandfetch.io/fiserv.com/w/400/h/400/theme/dark/icon.jpeg?t=1734242558418', status: 'Blocked', itemCount: 0 },
  { name: 'Checkout', color: '#6C5CE7', logo: 'https://cdn.brandfetch.io/checkout.com/w/400/h/400/theme/dark/icon.jpeg?t=1734242558418', status: 'Approved', itemCount: 2 },
  { name: 'Worldpay', color: '#D62828', logo: 'https://logo.clearbit.com/worldpay.com', status: 'Review', itemCount: 1 },
];

// Mock transaction
const MOCK_TRANSACTION = {
  id: 'tx-lab-001',
  merchantName: 'TechWorld Store',
  country: 'US',
  itemCount: 8
};

// Helper: Cubic bezier point calculation
function cubicBezierPoint(t: number, p0: { x: number; y: number }, p1: { x: number; y: number }, p2: { x: number; y: number }, p3: { x: number; y: number }) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
  const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;

  return { x, y };
}

export default function DemoLab() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [ports, setPorts] = useState<Map<string, Port>>(new Map());
  const [animationKey, setAnimationKey] = useState(0);
  const [showContainer, setShowContainer] = useState(false);
  const [canvasWidthScale, setCanvasWidthScale] = useState(100); // percentage
  const [nodePositions, setNodePositions] = useState({
    merchantX: 300,
    reveliusX: 700,
    pspX: 1000,
    demoContainerX: 200
  });
  const [isResizing, setIsResizing] = useState(false);
  const portRefsMap = useRef<Map<string, HTMLElement>>(new Map());
  const resizeTimeoutRef = useRef<number | null>(null);

  // Node dimensions (constants)
  const MERCHANT_WIDTH = 64; // w-16
  const REVELIUS_WIDTH = 96; // w-24
  const PSP_WIDTH = 220;
  const PSP_HEIGHT = 52;
  const PSP_GAP = 12; // gap-3
  
  // Reactive node gap - scales with canvas width
  const BASE_NODE_GAP = 280; // Gap at 100% canvas width
  const NODE_GAP = BASE_NODE_GAP * (canvasWidthScale / 100);
  
  // Demo container dimensions (for visualization)
  const DEMO_CONTAINER_WIDTH = MERCHANT_WIDTH + NODE_GAP + REVELIUS_WIDTH + NODE_GAP + PSP_WIDTH;
  const PSP_STACK_HEIGHT = (PSP_HEIGHT + PSP_GAP) * PSP_LIST.length - PSP_GAP;
  const DEMO_CONTAINER_HEIGHT = Math.max(PSP_STACK_HEIGHT, 150);

  // Restart token animation (debounced)
  const restartTokenAnimation = useCallback(() => {
    // Immediately hide tokens
    setIsResizing(true);
    
    if (resizeTimeoutRef.current !== null) {
      window.clearTimeout(resizeTimeoutRef.current);
    }
    
    resizeTimeoutRef.current = window.setTimeout(() => {
      // After resize stops, show tokens and restart animation
      setIsResizing(false);
      setAnimationKey(prev => prev + 1);
      resizeTimeoutRef.current = null;
    }, 100); // Debounce: wait 100ms after last resize
  }, []);

  // Calculate node positions based on actual canvas width
  const calculateNodePositions = useCallback(() => {
    if (!canvasRef.current) return;

    const actualCanvasWidth = canvasRef.current.getBoundingClientRect().width;
    const PADDING = 40; // Minimum padding on each side
    const availableWidth = actualCanvasWidth - (PADDING * 2);
    
    // Calculate required width with current NODE_GAP
    const requiredWidth = MERCHANT_WIDTH + NODE_GAP + REVELIUS_WIDTH + NODE_GAP + PSP_WIDTH;
    
    // Scale down NODE_GAP if container doesn't fit
    let adjustedNodeGap = NODE_GAP;
    if (requiredWidth > availableWidth) {
      // Calculate max gap that fits
      const maxGap = (availableWidth - MERCHANT_WIDTH - REVELIUS_WIDTH - PSP_WIDTH) / 2;
      adjustedNodeGap = Math.max(maxGap, 50); // Minimum gap of 50px
    }
    
    // Calculate actual demo container width with adjusted gap
    const actualContainerWidth = MERCHANT_WIDTH + adjustedNodeGap + REVELIUS_WIDTH + adjustedNodeGap + PSP_WIDTH;
    
    // Center the demo container in the canvas
    const demoContainerX = (actualCanvasWidth - actualContainerWidth) / 2;
    
    // Position nodes relative to the centered container
    const merchantX = demoContainerX + MERCHANT_WIDTH / 2;
    const reveliusX = merchantX + MERCHANT_WIDTH / 2 + adjustedNodeGap + REVELIUS_WIDTH / 2;
    const pspX = reveliusX + REVELIUS_WIDTH / 2 + adjustedNodeGap;

    setNodePositions({ merchantX, reveliusX, pspX, demoContainerX });
  }, [NODE_GAP]); // Add NODE_GAP as dependency so it uses current value

  // Recalculate positions when canvas resizes
  useEffect(() => {
    calculateNodePositions();

    const resizeObserver = new ResizeObserver(() => {
      calculateNodePositions();
      restartTokenAnimation();
    });

    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [calculateNodePositions, restartTokenAnimation]);

  // Update positions when scale changes
  useEffect(() => {
    if (!canvasRef.current) return;
    calculateNodePositions();
    restartTokenAnimation();
    // Small delay to allow DOM to update
    setTimeout(() => computePorts(), 0);
  }, [canvasWidthScale]);

  // Destructure positions for use in JSX
  const { merchantX, reveliusX, pspX, demoContainerX } = nodePositions;

  // Register port element
  const registerPortRef = useCallback((portId: string) => {
    return (element: HTMLElement | null) => {
      if (element) {
        portRefsMap.current.set(portId, element);
      } else {
        portRefsMap.current.delete(portId);
      }
    };
  }, []);

  // Compute port positions with tolerance check
  const computePorts = useCallback(() => {
    if (!canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newPorts = new Map<string, Port>();

    portRefsMap.current.forEach((element, portId) => {
      try {
        const rect = element.getBoundingClientRect();
        
        // Convert to canvas-local coordinates
        const localX = rect.left - canvasRect.left;
        const localY = rect.top - canvasRect.top;
        
        // Compute port position based on type
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
      } catch (error) {
        console.warn(`Failed to compute port ${portId}:`, error);
      }
    });

    // Only update if ports actually changed (tolerance: 1px)
    setPorts(prevPorts => {
      if (prevPorts.size !== newPorts.size) return newPorts;
      
      let changed = false;
      newPorts.forEach((port, portId) => {
        const prevPort = prevPorts.get(portId);
        if (!prevPort || Math.abs(prevPort.x - port.x) > 1 || Math.abs(prevPort.y - port.y) > 1) {
          changed = true;
        }
      });
      
      return changed ? newPorts : prevPorts;
    });
  }, []);

  // Initial port computation
  useEffect(() => {
    computePorts();
  }, [computePorts]);

  // Setup ResizeObserver on canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      // Debounce the recompute
      const timeoutId = setTimeout(() => {
        computePorts();
      }, 100);
      return () => clearTimeout(timeoutId);
    });

    resizeObserver.observe(canvasRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [computePorts]);

  // Recalculate ports on animation key change
  useEffect(() => {
    computePorts();
  }, [animationKey, computePorts]);

  // Recalculate ports when canvas width changes
  useEffect(() => {
    computePorts();
  }, [canvasWidthScale, computePorts]);

  // Recalculate ports when node positions change
  useEffect(() => {
    computePorts();
  }, [nodePositions, computePorts]);

  // Generate path data
  const generatePath = (startPort: Port | undefined, endPort: Port | undefined): string => {
    if (!startPort || !endPort) return '';

    const dx = endPort.x - startPort.x;
    const c1x = startPort.x + dx * 0.45;
    const c1y = startPort.y;
    const c2x = startPort.x + dx * 0.70;
    const c2y = endPort.y;

    return `M ${startPort.x} ${startPort.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endPort.x} ${endPort.y}`;
  };

  // Generate token animation path points
  const generateTokenPath = (startPort: Port | undefined, endPort: Port | undefined): { x: number; y: number }[] => {
    if (!startPort || !endPort) return [];

    const dx = endPort.x - startPort.x;
    const c1x = startPort.x + dx * 0.45;
    const c1y = startPort.y;
    const c2x = startPort.x + dx * 0.70;
    const c2y = endPort.y;

    const points: { x: number; y: number }[] = [];
    const p0 = startPort;
    const p1 = { x: c1x, y: c1y };
    const p2 = { x: c2x, y: c2y };
    const p3 = endPort;

    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      points.push(cubicBezierPoint(t, p0, p1, p2, p3));
    }

    return points;
  };

  const handleReplay = () => {
    setAnimationKey(prev => prev + 1);
  };

  // Get ports
  const merchantOut = ports.get('merchant:out');
  const reveliusIn = ports.get('revelius:in');
  const reveliusOut = ports.get('revelius:out');

  return (
    <div className="min-h-screen bg-white dark:bg-transparent relative overflow-hidden" 
         style={{
           backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
           backgroundSize: '20px 20px'
         }}>
      
      {/* Header */}
      <div className="absolute top-4 left-4 z-50">
        <div className="bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-lg font-bold text-gray-900">Demo Lab - Routing Visualization</h1>
          <p className="text-xs text-gray-500">Isolated testing environment</p>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
        <div className="flex gap-2">
          <button 
            onClick={() => setShowContainer(!showContainer)}
            className={`px-4 py-2 border rounded-lg shadow-sm flex items-center gap-2 text-sm font-medium transition-colors ${
              showContainer 
                ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            title="Toggle demo container visibility"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" strokeWidth="2" strokeDasharray="4 2" />
            </svg>
            {showContainer ? 'Hide' : 'Show'} Container
          </button>
          <button 
            onClick={handleReplay}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 flex items-center gap-2 text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Replay
          </button>
        </div>
        
        {/* Canvas Width Controls */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-3">
          <div className="text-xs font-medium text-gray-700 mb-2">Canvas Width: {canvasWidthScale}%</div>
          <div className="flex gap-1 mb-2">
            <button 
              onClick={() => setCanvasWidthScale(100)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                canvasWidthScale === 100 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              100%
            </button>
            <button 
              onClick={() => setCanvasWidthScale(70)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                canvasWidthScale === 70 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              70%
            </button>
            <button 
              onClick={() => setCanvasWidthScale(50)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                canvasWidthScale === 50 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              50%
            </button>
          </div>
          <input 
            type="range" 
            min="30" 
            max="100" 
            value={canvasWidthScale}
            onChange={(e) => setCanvasWidthScale(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${canvasWidthScale}%, #e5e7eb ${canvasWidthScale}%, #e5e7eb 100%)`
            }}
          />
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex items-center justify-center min-h-screen p-8">
        <div 
          ref={canvasRef}
          className="relative w-full h-[700px] bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-300"
          style={{ 
            maxWidth: `${1400 * (canvasWidthScale / 100)}px` 
          }}
        >
          {/* SVG Overlay for Lines */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
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
            {merchantOut && reveliusIn && (() => {
              const pathD = generatePath(merchantOut, reveliusIn);
              const pathLength = Math.hypot(reveliusIn.x - merchantOut.x, reveliusIn.y - merchantOut.y) * 1.2; // Approximate path length
              
              return (
                <>
                  {/* Base dotted line */}
                  <path
                    key={`merchant-revelius-${animationKey}`}
                    d={pathD}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    strokeLinecap="round"
                    opacity={0.5}
                  />
                  {/* Glowing surge line */}
                  <motion.path
                    key={`surge-${animationKey}`}
                    d={pathD}
                    fill="none"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeDasharray={`${pathLength * 0.25} ${pathLength * 2}`}
                    initial={{ 
                      strokeDashoffset: pathLength * 1.25, 
                      opacity: 0,
                      stroke: "#3b82f6"
                    }}
                    animate={{ 
                      strokeDashoffset: -pathLength * 0.5,
                      opacity: [0, 0.8, 0.8, 0],
                      stroke: ["#3b82f6", "#60a5fa", "#93c5fd"]
                    }}
                    transition={{
                      strokeDashoffset: {
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeIn",
                        repeatDelay: 0.8
                      },
                      opacity: {
                        duration: 2.5,
                        repeat: Infinity,
                        times: [0, 0.03, 0.95, 1],
                        repeatDelay: 0.8
                      },
                      stroke: {
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 0.8
                      }
                    }}
                    style={{ filter: 'blur(2px)' }}
                  />
                  <motion.path
                    key={`surge-sharp-${animationKey}`}
                    d={pathD}
                    fill="none"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeDasharray={`${pathLength * 0.25} ${pathLength * 2}`}
                    initial={{ 
                      strokeDashoffset: pathLength * 1.25, 
                      opacity: 0,
                      stroke: "#60a5fa"
                    }}
                    animate={{ 
                      strokeDashoffset: -pathLength * 0.5,
                      opacity: [0, 0.9, 0.9, 0],
                      stroke: ["#60a5fa", "#93c5fd", "#bfdbfe"]
                    }}
                    transition={{
                      strokeDashoffset: {
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeIn",
                        repeatDelay: 0.8
                      },
                      opacity: {
                        duration: 2.5,
                        repeat: Infinity,
                        times: [0, 0.03, 0.95, 1],
                        repeatDelay: 0.8
                      },
                      stroke: {
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 0.8
                      }
                    }}
                  />
                  <circle
                    cx={merchantOut.x}
                    cy={merchantOut.y}
                    r={3}
                    fill="#94a3b8"
                    opacity={0.6}
                  />
                  <circle
                    cx={reveliusIn.x}
                    cy={reveliusIn.y}
                    r={3}
                    fill="#94a3b8"
                    opacity={0.6}
                  />
                </>
              );
            })()}

            {/* Revelius to PSP lines */}
            {PSP_LIST.map((psp, index) => {
              const pspPort = ports.get(`psp:${psp.name}:in`);
              const isActive = psp.itemCount > 0;
              
              if (!reveliusOut || !pspPort) return null;

              const path = generatePath(reveliusOut, pspPort);
              const tokenPath = generateTokenPath(reveliusOut, pspPort);

              return (
                <g key={`${psp.name}-${animationKey}`}>
                  <path
                    d={path}
                    fill="none"
                    stroke={psp.color}
                    strokeWidth={isActive ? 3 : 2}
                    strokeDasharray={isActive ? 'none' : '6 4'}
                    filter={isActive ? "url(#glow)" : "none"}
                    strokeLinecap="round"
                    opacity={isActive ? 0.8 : 0.3}
                  />
                  {isActive && pspPort && (
                    <>
                      <circle
                        cx={pspPort.x}
                        cy={pspPort.y}
                        r={3}
                        fill={psp.color}
                        opacity={0.8}
                      />
                      <circle
                        cx={reveliusOut.x}
                        cy={reveliusOut.y}
                        r={2}
                        fill={psp.color}
                        opacity={0.4}
                      />
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Animated Tokens */}
          <div 
            className="absolute inset-0 pointer-events-none z-20"
          >
            {!isResizing && (
              <>
                {PSP_LIST.filter(psp => psp.itemCount > 0).map((psp, index) => {
                const pspPort = ports.get(`psp:${psp.name}:in`);
                const tokenPath = generateTokenPath(reveliusOut, pspPort);
                
                if (tokenPath.length === 0) return null;

                return (
                  <motion.div
                    key={`token-${psp.name}-${animationKey}`}
                    className="absolute w-6 h-6 bg-white border-2 rounded-full shadow-md flex items-center justify-center"
                    style={{
                      borderColor: psp.color,
                      left: 0,
                      top: 0
                    }}
                    initial={{ 
                      x: tokenPath[0].x - 12, 
                      y: tokenPath[0].y - 12,
                      scale: 0,
                      opacity: 0
                    }}
                    animate={{
                      x: tokenPath.map(p => p.x - 12),
                      y: tokenPath.map(p => p.y - 12),
                      scale: 1,
                      opacity: 1
                    }}
                    transition={{
                      x: { 
                        duration: 2.5, 
                        delay: 1.0 + index * 0.2,
                        ease: "linear",
                        repeat: Infinity
                      },
                      y: { 
                        duration: 2.5, 
                        delay: 1.0 + index * 0.2,
                        ease: "linear",
                        repeat: Infinity
                      },
                      scale: { duration: 0.3, delay: 1.0 + index * 0.2 },
                      opacity: { duration: 0.3, delay: 1.0 }
                    }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: psp.color }}
                    />
                  </motion.div>
                );
              })}
              </>
            )}
          </div>

          {/* Nodes Layer */}
          <div 
            className="absolute inset-0 z-30 pointer-events-none"
          >
            {/* Demo Container - invisible bounding box around all objects */}
            <div 
              key={`container-${demoContainerX}`}
              className="absolute pointer-events-none transition-all duration-300"
              style={{ 
                left: `${demoContainerX}px`,
                top: '50%',
                transform: 'translateY(-50%)',
                width: `${DEMO_CONTAINER_WIDTH}px`, 
                height: `${DEMO_CONTAINER_HEIGHT}px`,
                border: showContainer ? '2px dashed rgba(59, 130, 246, 0.5)' : 'none',
                backgroundColor: showContainer ? 'rgba(59, 130, 246, 0.05)' : 'transparent'
              }}
            />
            
            {/* Merchant Node - can move right if needed */}
            <div 
              key={`merchant-${merchantX}`}
              className="absolute flex flex-col items-center pointer-events-auto transition-all duration-300"
              style={{ left: `${merchantX}px`, top: '50%', transform: 'translate(-50%, -50%)' }}
            >
              <div className="relative w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Store className="w-8 h-8 text-white" />
                {/* Port marker: right-center */}
                <div 
                  ref={registerPortRef('merchant:out')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 opacity-0"
                />
              </div>
              <div className="mt-2 text-sm font-medium text-gray-900">
                {MOCK_TRANSACTION.merchantName}
              </div>
              <div className="text-xs text-gray-500">{MOCK_TRANSACTION.country}</div>
            </div>

            {/* Revelius Node - ALWAYS centered in canvas */}
            <div 
              key={`revelius-${reveliusX}`}
              className="absolute flex flex-col items-center pointer-events-auto transition-all duration-300"
              style={{ left: `${reveliusX}px`, top: '50%', transform: 'translate(-50%, -50%)' }}
            >
              <div className="relative">
                {/* Ripple effects */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ width: '96px', height: '96px', left: '0', top: '0' }}
                >
                  {/* Glowing ripples */}
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={`ripple-glow-${index}`}
                      className="absolute rounded-full bg-gray-800"
                      style={{ 
                        width: '96px', 
                        height: '96px',
                        boxShadow: '0 0 20px rgba(31, 41, 55, 0.6), 0 0 40px rgba(31, 41, 55, 0.3)'
                      }}
                      initial={{ scale: 1, opacity: 0.1 }}
                      animate={{ scale: 1.7, opacity: 0 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.7,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </motion.div>
                <div className="absolute inset-0 bg-gray-400 rounded-full blur-xl opacity-30" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center shadow-2xl">
                  <Zap className="w-12 h-12 text-white" />
                  {/* Port markers */}
                  <div 
                    ref={registerPortRef('revelius:in')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 opacity-0"
                  />
                  <div 
                    ref={registerPortRef('revelius:out')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 opacity-0"
                  />
                </div>
              </div>
              <div className="mt-2 text-sm font-bold text-gray-900">Revelius</div>
              <div className="text-xs text-gray-500">{MOCK_TRANSACTION.itemCount} items routing</div>
            </div>

            {/* PSP Stack - can move left if needed */}
            <div 
              key={`psp-${pspX}`}
              className="absolute flex flex-col gap-3 pointer-events-auto transition-all duration-300"
              style={{ left: `${pspX}px`, top: '50%', transform: 'translateY(-50%)' }}
            >
              {PSP_LIST.map((psp) => {
                const StatusIcon = psp.status === 'Approved' ? CheckCircle :
                  psp.status === 'Review' ? AlertTriangle : XCircle;
                
                const borderColor = psp.itemCount === 0 ? 'border-gray-200' :
                  psp.status === 'Approved' ? 'border-green-300' :
                  psp.status === 'Review' ? 'border-amber-400' : 'border-red-400';
                
                const iconColor = psp.status === 'Approved' ? 'text-green-500' :
                  psp.status === 'Review' ? 'text-amber-500' : 'text-red-500';

                const bgColor = psp.itemCount === 0 ? 'bg-gray-50' : 'bg-white';

                return (
                  <div
                    key={psp.name}
                    className={`relative w-[220px] h-[52px] ${bgColor} border-2 ${borderColor} rounded-xl shadow-md flex items-center gap-3 px-3 transition-all ${
                      psp.itemCount === 0 ? 'opacity-40' : 'opacity-100'
                    }`}
                  >
                    {/* Port marker */}
                    <div 
                      ref={registerPortRef(`psp:${psp.name}:in`)}
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 opacity-0"
                    />
                    <img 
                      src={psp.logo} 
                      alt={psp.name} 
                      className="w-7 h-7 rounded object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900 truncate">{psp.name}</div>
                    </div>
                    <StatusIcon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
                    {psp.itemCount > 0 && (
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                        {psp.itemCount}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md border border-gray-200 text-xs space-y-1">
        <div className="text-gray-500">Canvas width: <span className="font-bold text-gray-900">{Math.round(1400 * (canvasWidthScale / 100))}px ({canvasWidthScale}%)</span></div>
        <div className="text-gray-500">Demo container: <span className="font-bold text-blue-600">{DEMO_CONTAINER_WIDTH}px × {DEMO_CONTAINER_HEIGHT}px</span></div>
        <div className="text-gray-500">Node gap: <span className="font-bold text-emerald-600">{Math.round(NODE_GAP)}px</span> <span className="text-gray-400">(scales from {BASE_NODE_GAP}px)</span></div>
        <div className="text-gray-500 pt-1 border-t border-gray-200">
          Merchant X: <span className="font-bold text-gray-900">{Math.round(merchantX)}</span> | Revelius X: <span className="font-bold text-blue-600">{Math.round(reveliusX)}</span> | PSP X: <span className="font-bold text-gray-900">{Math.round(pspX)}</span>
        </div>
        <div className="text-gray-500">
          Ports: <span className="font-bold text-gray-900">{ports.size}</span> | Animation: <span className="font-bold text-gray-900">{animationKey}</span>
        </div>
      </div>
    </div>
  );
}
