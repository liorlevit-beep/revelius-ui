import { ReactNode, useRef, useState, MouseEvent } from 'react';
import styles from './tiltCard.module.css';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  rotationLimit?: number;
  glare?: boolean;
}

export function TiltCard({ 
  children, 
  className = '', 
  rotationLimit = 8,
  glare = true 
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation angles (inverted for natural tilt)
    const rotateY = (mouseX / (rect.width / 2)) * rotationLimit;
    const rotateX = -(mouseY / (rect.height / 2)) * rotationLimit;
    
    // Apply 3D transform
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    
    // Move glare element
    if (glare && glareRef.current) {
      const glareX = e.clientX - rect.left - 210; // Center the glare (420/2 = 210)
      const glareY = e.clientY - rect.top - 210;
      glareRef.current.style.left = `${glareX}px`;
      glareRef.current.style.top = `${glareY}px`;
    }
    
    setIsTransitioning(false);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    
    setIsTransitioning(true);
    
    // Reset transform
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    
    // Reset glare position
    if (glare && glareRef.current) {
      glareRef.current.style.left = '';
      glareRef.current.style.top = '';
    }
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.tiltCard} ${isTransitioning ? styles.isTransitioning : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {glare && <div ref={glareRef} className={styles.tiltGlare} />}
      <div className={styles.tiltContent}>{children}</div>
    </div>
  );
}
