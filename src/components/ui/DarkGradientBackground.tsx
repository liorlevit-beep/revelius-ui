import { useEffect, useRef, useState } from 'react';
import styles from './darkGradientBackground.module.css';

interface DarkGradientBackgroundProps {
  enabled?: boolean;
  intensity?: 'subtle' | 'normal' | 'strong';
  className?: string;
}

/**
 * Dark-mode animated gradient background with mouse-follow effect.
 * Only renders in dark mode. Sits behind all content with pointer-events: none.
 */
export function DarkGradientBackground({
  enabled = true,
  intensity = 'normal',
  className = '',
}: DarkGradientBackgroundProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const interactiveBlobRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      console.log('[DarkGradientBackground] Dark mode check:', isDark);
      console.log('[DarkGradientBackground] HTML classes:', document.documentElement.className);
      setIsDarkMode(isDark);
    };

    // Initial check
    checkDarkMode();

    // Watch for class changes on html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Mouse-follow effect with eased movement
  useEffect(() => {
    if (!isDarkMode || !enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    };

    const animate = () => {
      if (!interactiveBlobRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Eased lerp - slower interpolation (0.03 = slow easing)
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.03;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.03;

      // Apply transform
      interactiveBlobRef.current.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0)`;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start listening and animating
    window.addEventListener('mousemove', handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDarkMode, enabled]);

  // Don't render in light mode or if disabled
  if (!isDarkMode || !enabled) {
    console.log('[DarkGradientBackground] Not rendering:', { isDarkMode, enabled });
    return null;
  }

  console.log('[DarkGradientBackground] Rendering with intensity:', intensity);

  return (
    <div className={`${styles.container} ${styles[intensity]} ${className}`}>
      <div className={styles.gradientsContainer}>
        <div className={`${styles.blob} ${styles.g1}`} />
        <div className={`${styles.blob} ${styles.g2}`} />
        <div className={`${styles.blob} ${styles.g3}`} />
        <div className={`${styles.blob} ${styles.g4}`} />
        <div className={`${styles.blob} ${styles.g5}`} />
        <div
          ref={interactiveBlobRef}
          className={`${styles.blob} ${styles.interactive}`}
        />
      </div>
    </div>
  );
}
