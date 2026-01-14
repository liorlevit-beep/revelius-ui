import React, { ReactNode } from 'react';

type GlassPanelVariant = 'soft' | 'strong' | 'floating';

interface GlassPanelProps {
  children: ReactNode;
  variant?: GlassPanelVariant;
  className?: string;
  hover?: boolean;
  shimmer?: boolean;
}

const variantStyles: Record<GlassPanelVariant, string> = {
  soft: 'backdrop-blur-[12px] bg-white/[0.04] border-white/[0.08]',
  strong: 'backdrop-blur-[20px] bg-white/[0.08] border-white/[0.12]',
  floating: 'backdrop-blur-[16px] bg-white/[0.06] border-white/[0.10]',
};

const variantShadows: Record<GlassPanelVariant, string> = {
  soft: 'shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
  strong: 'shadow-[0_12px_48px_rgba(0,0,0,0.4)]',
  floating: 'shadow-[0_16px_64px_rgba(0,0,0,0.5)]',
};

export function GlassPanel({
  children,
  variant = 'soft',
  className = '',
  hover = true,
  shimmer = false,
}: GlassPanelProps) {
  const baseStyles = `
    relative rounded-2xl border overflow-hidden transition-all duration-200
    ${variantStyles[variant]}
    ${variantShadows[variant]}
    ${hover ? 'hover:-translate-y-1 hover:shadow-[0_16px_64px_rgba(0,0,0,0.5)]' : ''}
    ${className}
  `;

  return (
    <div className={baseStyles}>
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
