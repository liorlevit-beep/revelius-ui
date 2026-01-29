import { Link } from 'react-router-dom';

/**
 * Glossy button component with multiple variants:
 * - light: soft glass for dark backgrounds (hero CTAs)
 * - dark: deep glass for light backgrounds
 * - outline: light glass outline for dark backgrounds
 * - outline-dark: subtle glass outline for light backgrounds
 */
export default function GlossyButton({ 
  to, 
  href, 
  variant = 'dark', 
  children, 
  className = '',
  onClick,
  type = 'button',
  disabled = false
}) {
  const baseStyles = {
    display: 'inline-block',
    padding: '0.875rem 2.5rem',
    borderRadius: '50px',
    fontWeight: '700',
    fontSize: '0.9375rem',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    border: '1px solid transparent',
    position: 'relative',
    textDecoration: 'none',
  };

  // Light variant - for dark backgrounds (hero banner)
  const lightStyles = {
    ...baseStyles,
    background: `
      linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.95) 0%,
        rgba(240, 245, 255, 0.75) 20%,
        rgba(245, 240, 255, 0.6) 50%,
        rgba(255, 240, 250, 0.75) 80%,
        rgba(255, 255, 255, 0.95) 100%
      ),
      radial-gradient(
        ellipse at top left,
        rgba(120, 160, 255, 0.4) 0%,
        rgba(140, 180, 255, 0.2) 30%,
        transparent 60%
      ),
      radial-gradient(
        ellipse at bottom right,
        rgba(255, 120, 200, 0.35) 0%,
        rgba(255, 160, 220, 0.15) 30%,
        transparent 60%
      )
    `,
    border: '1px solid rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(24px) saturate(2)',
    WebkitBackdropFilter: 'blur(24px) saturate(2)',
    boxShadow: `
      inset 0 2px 4px rgba(255, 255, 255, 0.8),
      inset 0 -2px 4px rgba(180, 200, 240, 0.4)
    `,
    color: '#1a202c',
    textShadow: '0 0.5px 0 rgba(255, 255, 255, 0.9)',
  };

  // Dark variant - for light backgrounds
  const darkStyles = {
    ...baseStyles,
    background: `
      linear-gradient(
        135deg,
        rgba(31, 41, 55, 0.98) 0%,
        rgba(45, 55, 72, 0.85) 20%,
        rgba(17, 24, 39, 0.7) 50%,
        rgba(45, 55, 72, 0.85) 80%,
        rgba(31, 41, 55, 0.98) 100%
      ),
      radial-gradient(
        ellipse at top left,
        rgba(99, 102, 241, 0.3) 0%,
        rgba(99, 102, 241, 0.15) 30%,
        transparent 60%
      ),
      radial-gradient(
        ellipse at bottom right,
        rgba(139, 92, 246, 0.25) 0%,
        rgba(139, 92, 246, 0.1) 30%,
        transparent 60%
      )
    `,
    border: '1px solid rgba(75, 85, 99, 0.6)',
    backdropFilter: 'blur(16px) saturate(1.5)',
    WebkitBackdropFilter: 'blur(16px) saturate(1.5)',
    boxShadow: `
      inset 0 2px 4px rgba(139, 92, 246, 0.2),
      inset 0 -2px 4px rgba(0, 0, 0, 0.4)
    `,
    color: '#f3f4f6',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
  };

  // Outline variant - for dark backgrounds
  const outlineStyles = {
    ...baseStyles,
    background: `
      linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.35) 0%,
        rgba(240, 245, 255, 0.25) 20%,
        rgba(245, 240, 255, 0.15) 50%,
        rgba(255, 240, 250, 0.25) 80%,
        rgba(255, 255, 255, 0.35) 100%
      ),
      radial-gradient(
        ellipse at top left,
        rgba(120, 160, 255, 0.2) 0%,
        rgba(140, 180, 255, 0.1) 30%,
        transparent 60%
      )
    `,
    border: '1.5px solid rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(20px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
    boxShadow: `
      inset 0 1px 2px rgba(255, 255, 255, 0.5),
      inset 0 -1px 2px rgba(180, 200, 240, 0.3)
    `,
    color: '#f3f4f6',
    textShadow: '0 0.5px 0 rgba(255, 255, 255, 0.9)',
  };

  // Outline-dark variant - for light backgrounds
  const outlineDarkStyles = {
    ...baseStyles,
    background: `
      linear-gradient(
        135deg,
        rgba(248, 250, 252, 0.9) 0%,
        rgba(241, 245, 249, 0.8) 20%,
        rgba(248, 250, 252, 0.7) 50%,
        rgba(241, 245, 249, 0.8) 80%,
        rgba(248, 250, 252, 0.9) 100%
      ),
      radial-gradient(
        ellipse at top left,
        rgba(99, 102, 241, 0.06) 0%,
        rgba(99, 102, 241, 0.03) 40%,
        transparent 70%
      )
    `,
    border: '1.5px solid rgba(30, 41, 59, 0.25)',
    backdropFilter: 'blur(12px) saturate(1.5)',
    WebkitBackdropFilter: 'blur(12px) saturate(1.5)',
    boxShadow: `
      inset 0 1px 2px rgba(255, 255, 255, 0.8),
      inset 0 -1px 2px rgba(148, 163, 184, 0.2)
    `,
    color: '#1a202c',
  };

  const styles = variant === 'outline-dark' ? outlineDarkStyles : 
                 variant === 'outline' ? outlineStyles : 
                 variant === 'light' ? lightStyles : 
                 darkStyles;

  const handleMouseEnter = (e) => {
    if (variant === 'light') {
      e.currentTarget.style.boxShadow = `
        inset 0 2px 4px rgba(255, 255, 255, 0.9),
        inset 0 -2px 4px rgba(180, 200, 240, 0.5),
        0 0 0 1px rgba(59, 130, 246, 0.3),
        0 0 20px 2px rgba(59, 130, 246, 0.15)
      `;
      e.currentTarget.style.transform = 'translateY(-1px)';
    } else if (variant === 'dark') {
      e.currentTarget.style.boxShadow = `
        inset 0 2px 4px rgba(139, 92, 246, 0.3),
        inset 0 -2px 4px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(99, 102, 241, 0.4),
        0 0 16px 2px rgba(99, 102, 241, 0.2)
      `;
      e.currentTarget.style.transform = 'translateY(-1px)';
    } else if (variant === 'outline') {
      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
      e.currentTarget.style.background = `
        linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.45) 0%,
          rgba(240, 245, 255, 0.35) 20%,
          rgba(245, 240, 255, 0.25) 50%,
          rgba(255, 240, 250, 0.35) 80%,
          rgba(255, 255, 255, 0.45) 100%
        )
      `;
      e.currentTarget.style.transform = 'translateY(-1px)';
    } else if (variant === 'outline-dark') {
      e.currentTarget.style.borderColor = 'rgba(30, 41, 59, 0.4)';
      e.currentTarget.style.boxShadow = `
        inset 0 1px 2px rgba(255, 255, 255, 0.9),
        inset 0 -1px 2px rgba(148, 163, 184, 0.3),
        0 0 0 1px rgba(99, 102, 241, 0.15)
      `;
      e.currentTarget.style.transform = 'translateY(-1px)';
    }
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.boxShadow = styles.boxShadow;
    e.currentTarget.style.transform = 'translateY(0)';
    if (variant === 'outline') {
      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
      e.currentTarget.style.background = outlineStyles.background;
    } else if (variant === 'outline-dark') {
      e.currentTarget.style.borderColor = 'rgba(30, 41, 59, 0.25)';
    }
  };

  const commonProps = {
    className,
    style: styles,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick,
  };

  // Internal link
  if (to) {
    return (
      <Link to={to} {...commonProps}>
        {children}
      </Link>
    );
  }

  // External link
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...commonProps}>
        {children}
      </a>
    );
  }

  // Button element
  return (
    <button type={type} disabled={disabled} {...commonProps}>
      {children}
    </button>
  );
}
