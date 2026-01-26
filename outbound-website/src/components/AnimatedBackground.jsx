import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const interactiveBlobRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    };

    const animate = () => {
      if (!interactiveBlobRef.current) {
        requestAnimationFrame(animate);
        return;
      }

      // Smooth easing
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.03;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.03;

      // Apply transform
      interactiveBlobRef.current.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0)`;

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes moveInCircle {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          50% { transform: translate(-50%, -50%) rotate(180deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes moveVertical {
          0% { transform: translate(-50%, -50%) translateY(-50%); }
          50% { transform: translate(-50%, -50%) translateY(50%); }
          100% { transform: translate(-50%, -50%) translateY(-50%); }
        }
        
        @keyframes moveHorizontal {
          0% { transform: translate(-50%, -50%) translateX(-50%) translateY(-10%); }
          50% { transform: translate(-50%, -50%) translateX(50%) translateY(10%); }
          100% { transform: translate(-50%, -50%) translateX(-50%) translateY(-10%); }
        }
      `}</style>
      
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'linear-gradient(40deg, #0a0a0f, #1a0f2e, #0f1a2e, #0a0a0f)',
      }}>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          filter: 'blur(80px) saturate(150%)',
          top: 0,
          left: 0,
          opacity: 0.55,
        }}>
          {/* Blob 1 - Blue */}
          <div style={{
            position: 'absolute',
            borderRadius: '50%',
            mixBlendMode: 'hard-light',
            width: '80%',
            height: '80%',
            left: '50%',
            top: '50%',
            transformOrigin: '50% 50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.8) 0, rgba(59, 130, 246, 0) 50%) no-repeat',
            animation: 'moveVertical 50s ease infinite, moveHorizontal 80s ease infinite',
          }} />
          
          {/* Blob 2 - Purple */}
          <div style={{
            position: 'absolute',
            borderRadius: '50%',
            mixBlendMode: 'hard-light',
            width: '80%',
            height: '80%',
            left: '50%',
            top: '50%',
            transformOrigin: '50% 50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.8) 0, rgba(168, 85, 247, 0) 50%) no-repeat',
            animation: 'moveInCircle 40s reverse infinite, moveHorizontal 60s ease infinite',
          }} />
          
          {/* Blob 3 - Pink */}
          <div style={{
            position: 'absolute',
            borderRadius: '50%',
            mixBlendMode: 'hard-light',
            width: '80%',
            height: '80%',
            left: '50%',
            top: '50%',
            transformOrigin: '50% 50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle at center, rgba(236, 72, 153, 0.8) 0, rgba(236, 72, 153, 0) 50%) no-repeat',
            animation: 'moveInCircle 60s linear infinite, moveVertical 70s ease infinite',
          }} />
          
          {/* Blob 4 - Cyan */}
          <div style={{
            position: 'absolute',
            borderRadius: '50%',
            mixBlendMode: 'hard-light',
            width: '80%',
            height: '80%',
            left: '50%',
            top: '50%',
            transformOrigin: '50% 50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.8) 0, rgba(14, 165, 233, 0) 50%) no-repeat',
            animation: 'moveHorizontal 70s ease infinite, moveVertical 60s ease infinite',
          }} />
          
          {/* Blob 5 - Violet */}
          <div style={{
            position: 'absolute',
            borderRadius: '50%',
            mixBlendMode: 'hard-light',
            width: '80%',
            height: '80%',
            left: '50%',
            top: '50%',
            transformOrigin: '50% 50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.8) 0, rgba(139, 92, 246, 0) 50%) no-repeat',
            animation: 'moveInCircle 50s ease infinite, moveHorizontal 90s ease infinite',
          }} />
          
          {/* Interactive blob (mouse follower) */}
          <div
            ref={interactiveBlobRef}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              mixBlendMode: 'hard-light',
              width: '100%',
              height: '100%',
              top: '-50%',
              left: '-50%',
              transform: 'translate(0, 0)',
              willChange: 'transform',
              background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.9) 0, rgba(99, 102, 241, 0) 50%) no-repeat',
            }}
          />
        </div>
      </div>
    </>
  );
}
