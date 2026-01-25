import type { ReactNode } from 'react';

interface DashboardLiquidGlassThemeProps {
  children: ReactNode;
}

export function DashboardLiquidGlassTheme({ children }: DashboardLiquidGlassThemeProps) {
  return (
    <div
      className="liquid-glass-dashboard min-h-screen relative overflow-x-hidden"
      style={{
        background: 'transparent',
        // CSS Variables for the theme
        ['--color-obsidian' as string]: '#0a0a0f',
        ['--color-deep-indigo' as string]: '#1e1b4b',
        ['--color-iridescent-cyan' as string]: '#06b6d4',
        ['--color-burnt-amber' as string]: '#d97706',
        ['--color-silver-mist' as string]: '#cbd5e1',
        ['--color-silver-mist-dim' as string]: '#94a3b8',
        ['--glass-blur-soft' as string]: '12px',
        ['--glass-blur-strong' as string]: '20px',
        ['--glass-opacity-soft' as string]: '0.4',
        ['--glass-opacity-strong' as string]: '0.6',
        ['--glass-border' as string]: 'rgba(203, 213, 225, 0.15)',
        ['--glass-border-bright' as string]: 'rgba(203, 213, 225, 0.3)',
        ['--glass-shadow' as string]: '0 8px 32px rgba(0, 0, 0, 0.4)',
        ['--glass-shadow-hover' as string]: '0 12px 48px rgba(0, 0, 0, 0.5)',
      }}
    >
      {children}
    </div>
  );
}
