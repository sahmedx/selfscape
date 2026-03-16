"use client";

import { useMemo } from "react";

interface MapParticlesProps {
  color: string;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export default function MapParticles({ color }: MapParticlesProps) {
  const particles = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${rand() * 100}%`,
      top: `${rand() * 100}%`,
      size: 2 + rand() * 2,
      delay: `${rand() * 20}s`,
      duration: `${15 + rand() * 10}s`,
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            animation: `particleDrift ${p.duration} linear ${p.delay} infinite`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
