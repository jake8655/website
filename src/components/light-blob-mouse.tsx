import { useEffect, useState } from 'react';

export default function LightBlobMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className='pointer-events-none fixed -z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary blur-[150px]'
      style={{
        top: position.y,
        left: position.x,
      }}
    />
  );
}
