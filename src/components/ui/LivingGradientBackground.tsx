import { useEffect, useRef, useState } from 'react';
import styles from './livingGradientBackground.module.css';

interface LivingGradientBackgroundProps {
  enabled?: boolean;
  intensity?: 'subtle' | 'normal' | 'strong';
  className?: string;
}

/**
 * Living Gradient Background - Works in both light and dark modes
 * 
 * Features:
 * - Animated gradient blobs with smooth motion
 * - Mouse-follow interactive blob
 * - Theme-aware colors via CSS tokens
 * - White veil overlay in light mode for legibility
 * - Identical animation timing across themes
 * - Performance optimized with transform animations
 * - Accessibility: respects prefers-reduced-motion
 * 
 * Layering:
 * 1. Base gradient layer (--bg-grad-base-*)
 * 2. Animated blob layer (--bg-grad-blob-*)
 * 3. White veil (light mode only, --bg-grad-veil)
 * 4. App content (above this component)
 */
export function LivingGradientBackground({
  enabled = true,
  intensity = 'normal',
  className = '',
}: LivingGradientBackgroundProps) {
  const interactiveBlobRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  // Mouse-follow effect with eased movement
  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    };

    const animate = () => {
      if (!interactiveBlobRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Eased lerp - slow interpolation for smooth following (0.03 = gentle easing)
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.03;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.03;

      // Apply transform (GPU-accelerated)
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
  }, [enabled]);

  // Don't render if disabled
  if (!enabled) {
    return null;
  }

  return (
    <div className={`${styles.container} ${styles[intensity]} ${className}`}>
      {/* Animated gradient blobs */}
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
      
      {/* White veil overlay for light mode legibility */}
      <div className={styles.veil} />
    </div>
  );
}
