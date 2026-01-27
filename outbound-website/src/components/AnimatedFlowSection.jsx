import { useState, useEffect, useRef } from 'react';
import { Search, Brain, GitBranch, Shield } from 'lucide-react';

export default function AnimatedFlowSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeLogs, setActiveLogs] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(0);
  const logContainerRef = useRef(null);

  const steps = [
    { id: 0, label: 'Discover', icon: Search, color: '#3b82f6' },
    { id: 1, label: 'Understand', icon: Brain, color: '#8b5cf6' },
    { id: 2, label: 'Route', icon: GitBranch, color: '#10b981' },
    { id: 3, label: 'Prove', icon: Shield, color: '#f97316' }
  ];

  const scenarios = [
    {
      logs: [
        { step: 0, text: 'Scanning website...', delay: 0 },
        { step: 0, text: 'Found: E-commerce platform', delay: 600 },
        { step: 0, text: 'Detected: Electronics & accessories', delay: 1200 },
        { step: 1, text: 'Analyzing product catalog...', delay: 1800 },
        { step: 1, text: 'Risk profile: Medium', delay: 2400 },
        { step: 1, text: 'Compliance status: Verified', delay: 3000 },
        { step: 2, text: 'Evaluating provider options...', delay: 3600 },
        { step: 2, text: 'Best match: Provider A (94% confidence)', delay: 4200 },
        { step: 2, text: 'Routing decision complete', delay: 4800 },
        { step: 3, text: 'Generating evidence package...', delay: 5400 },
        { step: 3, text: 'Evidence ready for audit', delay: 6000 }
      ]
    },
    {
      logs: [
        { step: 0, text: 'Scanning marketplace...', delay: 0 },
        { step: 0, text: 'Found: Multi-vendor platform', delay: 600 },
        { step: 0, text: 'Detected: Fashion & apparel', delay: 1200 },
        { step: 1, text: 'Processing merchant data...', delay: 1800 },
        { step: 1, text: 'Risk profile: Low', delay: 2400 },
        { step: 1, text: 'Regional compliance: EU verified', delay: 3000 },
        { step: 2, text: 'Calculating optimal route...', delay: 3600 },
        { step: 2, text: 'Recommended: Provider B', delay: 4200 },
        { step: 2, text: 'Routing configured', delay: 4800 },
        { step: 3, text: 'Building audit trail...', delay: 5400 },
        { step: 3, text: 'Evidence package complete', delay: 6000 }
      ]
    },
    {
      logs: [
        { step: 0, text: 'Analyzing subscription service...', delay: 0 },
        { step: 0, text: 'Found: SaaS platform', delay: 600 },
        { step: 0, text: 'Detected: B2B software', delay: 1200 },
        { step: 1, text: 'Evaluating recurring patterns...', delay: 1800 },
        { step: 1, text: 'Risk profile: Very low', delay: 2400 },
        { step: 1, text: 'Compliance: Multi-region cleared', delay: 3000 },
        { step: 2, text: 'Optimizing for recurring...', delay: 3600 },
        { step: 2, text: 'Provider C selected', delay: 4200 },
        { step: 2, text: 'Route established', delay: 4800 },
        { step: 3, text: 'Documenting decision...', delay: 5400 },
        { step: 3, text: 'Evidence archived', delay: 6000 }
      ]
    },
    {
      logs: [
        { step: 0, text: 'Scanning fintech app...', delay: 0 },
        { step: 0, text: 'Found: Digital wallet', delay: 600 },
        { step: 0, text: 'Detected: Financial services', delay: 1200 },
        { step: 1, text: 'Checking regulatory requirements...', delay: 1800 },
        { step: 1, text: 'Risk profile: Elevated', delay: 2400 },
        { step: 1, text: 'Enhanced verification required', delay: 3000 },
        { step: 2, text: 'Filtering eligible providers...', delay: 3600 },
        { step: 2, text: 'Provider D approved', delay: 4200 },
        { step: 2, text: 'Routing approved', delay: 4800 },
        { step: 3, text: 'Creating compliance records...', delay: 5400 },
        { step: 3, text: 'Evidence finalized', delay: 6000 }
      ]
    },
    {
      logs: [
        { step: 0, text: 'Discovering travel platform...', delay: 0 },
        { step: 0, text: 'Found: Booking service', delay: 600 },
        { step: 0, text: 'Detected: Travel & hospitality', delay: 1200 },
        { step: 1, text: 'Analyzing booking patterns...', delay: 1800 },
        { step: 1, text: 'Risk profile: Medium-high', delay: 2400 },
        { step: 1, text: 'Cross-border requirements mapped', delay: 3000 },
        { step: 2, text: 'Selecting multi-currency provider...', delay: 3600 },
        { step: 2, text: 'Provider E matched', delay: 4200 },
        { step: 2, text: 'Global routing set', delay: 4800 },
        { step: 3, text: 'Compiling evidence...', delay: 5400 },
        { step: 3, text: 'Audit trail ready', delay: 6000 }
      ]
    }
  ];

  useEffect(() => {
    const scenario = scenarios[currentScenario];
    let timeouts = [];
    
    // Reset state
    setActiveStep(0);
    setActiveLogs([]);

    // Animate logs
    scenario.logs.forEach((log) => {
      const timeout = setTimeout(() => {
        setActiveLogs(prev => [...prev, log]);
        if (logContainerRef.current) {
          logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
      }, log.delay);
      timeouts.push(timeout);
    });

    // Animate segments and circles based on log transitions
    const stepTransitions = [
      { delay: 0 }, // Step 0 starts immediately
      { delay: 1800 }, // Step 1 starts when understanding begins
      { delay: 3600 }, // Step 2 starts when routing begins
      { delay: 5400 }, // Step 3 starts when proving begins
    ];

    stepTransitions.forEach((transition, index) => {
      const timeout = setTimeout(() => {
        setActiveStep(index);
      }, transition.delay);
      timeouts.push(timeout);
    });

    // Loop to next scenario
    const loopTimeout = setTimeout(() => {
      setCurrentScenario((prev) => (prev + 1) % scenarios.length);
    }, 8000);
    timeouts.push(loopTimeout);

    return () => timeouts.forEach(t => clearTimeout(t));
  }, [currentScenario]);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900/20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <h2 className="text-4xl font-bold text-center mb-4 text-white">
          From context to decisions in real time
        </h2>
        <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
          Watch how Revelius transforms merchant context into actionable intelligence
        </p>

        {/* Flow visualization */}
        <div className="relative mb-16">
          <div className="flex justify-between items-center relative">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = activeStep >= index;
              const isCurrentlyActive = activeStep === index;
              
              return (
                <div key={step.id} className="flex flex-col items-center relative" style={{ flex: 1 }}>
                  {/* Progress segment (line before circle, except first) */}
                  {index > 0 && (
                    <div 
                      style={{
                        position: 'absolute',
                        left: 'calc(-50% + 60px)',
                        right: 'calc(50% + 60px)',
                        top: '60px',
                        height: '3px',
                        background: activeStep >= index ? 
                          `linear-gradient(90deg, ${steps[index-1].color}, ${step.color})` : 
                          'rgba(255, 255, 255, 0.1)',
                        transition: 'all 1.2s ease-in-out',
                        zIndex: 1
                      }}
                    />
                  )}

                  {/* Circle container with glass effect */}
                  <div
                    style={{
                      position: 'relative',
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: isCurrentlyActive ? 'rgba(255, 255, 255, 0.95)' : isActive ? step.color : 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: isActive ? `3px solid ${step.color}` : '3px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transform: isCurrentlyActive ? 'scale(1.15)' : isActive ? 'scale(1)' : 'scale(0.95)',
                      boxShadow: isCurrentlyActive ? 
                        `0 0 0 8px ${step.color}20, 0 0 40px ${step.color}40, inset 0 2px 8px rgba(255,255,255,0.8)` : 
                        isActive ? 
                        `0 0 20px ${step.color}50, 0 4px 12px ${step.color}30` : 
                        '0 4px 12px rgba(0,0,0,0.1)',
                      zIndex: isCurrentlyActive ? 20 : isActive ? 15 : 10,
                      overflow: 'hidden',
                    }}
                  >
                    {/* Radial gradient overlay for glass effect */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: isCurrentlyActive ? 'radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.3) 60%, transparent 100%)' : 'none',
                      pointerEvents: 'none',
                      transition: 'opacity 0.8s ease'
                    }} />
                    
                    {/* Icon */}
                    <StepIcon 
                      size={32}
                      color={isCurrentlyActive ? step.color : isActive ? '#ffffff' : '#9ca3af'}
                      strokeWidth={2.5}
                      style={{
                        transition: 'all 0.8s ease',
                        position: 'relative',
                        zIndex: 2,
                        marginBottom: '8px'
                      }}
                    />
                    
                    {/* Label */}
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      color: isCurrentlyActive ? step.color : isActive ? '#ffffff' : '#9ca3af',
                      transition: 'all 0.8s ease',
                      position: 'relative',
                      zIndex: 2
                    }}>
                      {step.label}
                    </span>

                    {/* Ripple effect on activation */}
                    {isCurrentlyActive && (
                      <div style={{
                        position: 'absolute',
                        inset: '-3px',
                        borderRadius: '50%',
                        border: `2px solid ${step.color}`,
                        animation: 'ripple 1.5s ease-out',
                        opacity: 0,
                      }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Log window */}
        <div className="max-w-4xl mx-auto">
          <div 
            className="bg-gray-950/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl"
            style={{
              minHeight: '240px',
              maxHeight: '240px',
            }}
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-700/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-gray-400 text-sm font-mono ml-2">
                revelius-intelligence-engine
              </span>
            </div>
            
            <div 
              ref={logContainerRef}
              className="font-mono text-sm space-y-2 overflow-y-auto"
              style={{ maxHeight: '160px' }}
            >
              {activeLogs.map((log, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3"
                  style={{
                    animation: 'fadeIn 0.3s ease-out',
                    opacity: 1
                  }}
                >
                  <span className="text-gray-500 select-none">&gt;</span>
                  <span 
                    style={{ 
                      color: steps[log.step].color,
                      textShadow: `0 0 10px ${steps[log.step].color}40`
                    }}
                  >
                    {log.text}
                  </span>
                </div>
              ))}
              {activeLogs.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">&gt;</span>
                  <span 
                    className="inline-block w-2 h-4 bg-blue-400"
                    style={{ animation: 'blink 1s step-end infinite' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
