import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md dark:hover:shadow-lg transition-shadow ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-50 dark:border-white/10">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
