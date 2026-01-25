import type { ReactNode } from 'react';

type GlassPanelVariant = 'soft' | 'strong' | 'floating';

interface GlassPanelProps {
  children: ReactNode;
  variant?: GlassPanelVariant;
  className?: string;
  hover?: boolean;
  shimmer?: boolean;
}

export function GlassPanel({
  children,
  variant = 'soft',
  className = '',
  hover = true,
  shimmer = false,
}: GlassPanelProps) {
  // Glassmorphism styling inspired by modern glass UI patterns
  const variantConfig = {
    soft: {
      bgOpacity: '0.05',
      borderOpacity: '0.18',
      blur: '10px',
      shadowSize: '20px',
      shadowOpacity: '0.1',
    },
    strong: {
      bgOpacity: '0.1',
      borderOpacity: '0.25',
      blur: '16px',
      shadowSize: '30px',
      shadowOpacity: '0.15',
    },
    floating: {
      bgOpacity: '0.08',
      borderOpacity: '0.2',
      blur: '14px',
      shadowSize: '25px',
      shadowOpacity: '0.12',
    },
  };

  const config = variantConfig[variant];

  return (
    <div 
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${hover ? 'hover:-translate-y-1' : ''} ${className}`}
      style={{
        background: `rgba(255, 255, 255, ${config.bgOpacity})`,
        backdropFilter: `blur(${config.blur}) saturate(180%)`,
        WebkitBackdropFilter: `blur(${config.blur}) saturate(180%)`,
        border: `1px solid rgba(255, 255, 255, ${config.borderOpacity})`,
        boxShadow: `
          0 8px ${config.shadowSize} rgba(0, 0, 0, ${config.shadowOpacity}),
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          inset 0 -1px 0 rgba(0, 0, 0, 0.1)
        `,
      }}
    >
      {/* Subtle gradient overlay for depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
