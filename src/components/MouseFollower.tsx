import { useEffect, useState, useRef } from 'react';

export default function MouseFollower() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const rafRef = useRef<number>();

  useEffect(() => {
    let currentX = -100;
    let currentY = -100;
    let targetX = -100;
    let targetY = -100;
    let idleTimer: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      
      if (!isVisible) {
        setIsVisible(true);
        currentX = targetX;
        currentY = targetY;
      }

      setIsIdle(false);
      clearTimeout(idleTimer);

      idleTimer = window.setTimeout(() => {
        setIsIdle(true);
      }, 1000);
    };

    const animate = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      
      currentX += dx;
      currentY += dy;

      setPosition({ x: currentX, y: currentY });
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      clearTimeout(idleTimer);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[99999] will-change-transform"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <img
        src="https://static.readdy.ai/image/bc643c8b59bbabdae08d70c4ecbda03c/e525552617bdfa1d7c51de70bef923ec.png"
        alt="Cursor"
        className={`w-16 h-16 object-contain ${isIdle ? 'animate-bounce' : ''}`}
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
        }}
      />
    </div>
  );
}
