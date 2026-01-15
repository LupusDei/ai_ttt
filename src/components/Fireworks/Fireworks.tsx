import type React from 'react';
import { useMemo } from 'react';
import './Fireworks.css';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  speed: number;
  delay: number;
}

interface FireworksProps {
  isActive: boolean;
  winner: 'X' | 'O' | null;
}

const PARTICLE_COLORS = {
  X: ['#60a5fa', '#3b82f6', '#2563eb', '#93c5fd', '#bfdbfe'], // Blue shades for X
  O: ['#f87171', '#ef4444', '#dc2626', '#fca5a5', '#fecaca'], // Red shades for O
};

function generateParticles(winner: 'X' | 'O'): Particle[] {
  const colors = PARTICLE_COLORS[winner];
  const particles: Particle[] = [];

  // Create multiple bursts
  for (let burst = 0; burst < 3; burst++) {
    const burstX = 20 + Math.random() * 60; // Random X position (20-80%)
    const burstDelay = burst * 0.3;

    // Each burst has multiple particles
    for (let i = 0; i < 20; i++) {
      particles.push({
        id: burst * 20 + i,
        x: burstX,
        y: 50 + Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 8,
        angle: Math.random() * 360,
        speed: 50 + Math.random() * 100,
        delay: burstDelay + Math.random() * 0.2,
      });
    }
  }

  return particles;
}

export function Fireworks({ isActive, winner }: FireworksProps): React.JSX.Element | null {
  // Generate particles when fireworks become active
  // Using useMemo to ensure particles are generated once per activation
  const particles = useMemo((): Particle[] => {
    if (isActive && winner) {
      return generateParticles(winner);
    }
    return [];
  }, [isActive, winner]);

  if (!isActive || !winner || particles.length === 0) {
    return null;
  }

  return (
    <div className="fireworks-container" aria-hidden="true">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="firework-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            '--angle': `${particle.angle}deg`,
            '--speed': `${particle.speed}px`,
            animationDelay: `${particle.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
