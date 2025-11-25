'use client'

import { useState, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

export default function HeroSection() {
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });
  const [isMoving, setIsMoving] = useState<boolean>(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent): void => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;

      setPosition({ x, y });
      setIsMoving(true);

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsMoving(false), 150);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      className="relative w-full h-screen overflow-hidden transition-all duration-300 ease-out"
      style={{
        background: `radial-gradient(circle at ${position.x}% ${position.y}%, 
          rgb(59, 130, 246) 0%, 
          rgb(147, 51, 234) 25%, 
          rgb(219, 39, 119) 50%, 
          rgb(239, 68, 68) 75%, 
          rgb(15, 23, 42) 100%)`,
      }}
    >
      {/* Overlay untuk efek lebih halus */}
      <div className="absolute inset-0 bg-linear-to-br from-black/20 to-transparent pointer-events-none" />

      {/* Cursor spotlight effect */}
      <div
        className="absolute w-96 h-96 rounded-full pointer-events-none transition-all duration-300 ease-out blur-3xl opacity-30"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: `translate(-50%, -50%) scale(${isMoving ? 1.2 : 1})`,
          background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        <h1 className="text-6xl font-bold mb-4 drop-shadow-2xl">
          Gerakkan Cursor Anda
        </h1>
        <p className="text-xl text-white/80 drop-shadow-lg">
          Warna akan mengikuti pergerakan mouse Anda
        </p>

        {/* Koordinat cursor (opsional) */}
        <div className="absolute bottom-8 right-8 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm">
          X: {position.x.toFixed(1)}% | Y: {position.y.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}