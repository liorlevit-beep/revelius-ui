import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`glass-surface glass-hover rounded-2xl ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200/50 dark:border-white/10">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
