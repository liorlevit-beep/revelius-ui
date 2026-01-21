import { forwardRef, useRef, useState, useEffect } from 'react';

interface IridescentButtonProps {
  active?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  as?: 'button' | 'a';
  href?: string;
}

export const IridescentButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  IridescentButtonProps
>(({ active = false, icon, children, onClick, className = '', as = 'button', href }, ref) => {
  // 3D tilt disabled for debugging
  const internalRef = useRef<HTMLElement>(null);
  
  const baseClass = `ir-btn ${active ? 'ir-btn--active' : ''} ${className}`.trim();
  
  const content = (
    <>
      <span className="ir-drop" aria-hidden="true" />
      <span className="ir-sheen" aria-hidden="true" />
      <span className="ir-content">
        {icon && <span className="ir-icon">{icon}</span>}
        <span className="ir-label">{children}</span>
      </span>
    </>
  );

  if (as === 'a' && href) {
    return (
      <a
        ref={(node) => {
          (internalRef as React.MutableRefObject<HTMLElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
        }}
        href={href}
        className={baseClass}
        style={active ? tiltStyle : undefined}
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={(node) => {
        (internalRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }}
      type="button"
      className={baseClass}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
    >
      {content}
    </button>
  );
});

IridescentButton.displayName = 'IridescentButton';
