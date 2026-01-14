import React, { ReactNode } from 'react';

interface GlassChartWrapperProps {
  children: ReactNode;
  title?: string;
}

/**
 * A glass-theme aware chart wrapper that provides proper styling
 * for charts rendered within the liquid glass theme.
 * This replaces the Card component for charts in the glass Dashboard.
 */
export function GlassChartWrapper({ children, title }: GlassChartWrapperProps) {
  return (
    <div>
      {title && (
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--glass-border)' }}>
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-silver-mist)' }}>
            {title}
          </h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
