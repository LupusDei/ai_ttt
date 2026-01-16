import type React from 'react';
import { useMemo } from 'react';
import './Fireworks.css';

type ParticleType = 'primary' | 'secondary' | 'sparkle' | 'trail';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  speed: number;
  rise: number;
  delay: number;
  type: ParticleType;
}

interface FireworksProps {
  isActive: boolean;
  winner: 'X' | 'O' | null;
}

// Extended color palette with highlights
const PARTICLE_COLORS = {
  X: [
    '#60a5fa', '#3b82f6', '#2563eb', '#93c5fd', '#bfdbfe', // Blues
    '#818cf8', '#a5b4fc', // Purple highlights
    '#ffffff', '#f0f9ff', // White sparkles
  ],
  O: [
    '#f87171', '#ef4444', '#dc2626', '#fca5a5', '#fecaca', // Reds
    '#fb923c', '#fdba74', // Orange highlights
    '#ffffff', '#fef2f2', // White sparkles
  ],
};

function generateParticles(winner: 'X' | 'O'): Particle[] {
  const colors = PARTICLE_COLORS[winner];
  const particles: Particle[] = [];
  let particleId = 0;

  // Create multiple spectacular bursts
  const numBursts = 8;

  for (let burst = 0; burst < numBursts; burst++) {
    // Position bursts around the center area where the status text is
    const burstX = 25 + Math.random() * 50; // Random X position (25-75%)
    const burstY = 30 + Math.random() * 25; // Random Y position (30-55%)
    const burstDelay = burst * 0.5; // Stagger bursts more

    // Primary particles - large, bright, lead the bloom
    for (let i = 0; i < 25; i++) {
      const angle = (i / 25) * 360 + Math.random() * 15; // Even spread with variation
      particles.push({
        id: particleId++,
        x: burstX + (Math.random() - 0.5) * 4,
        y: burstY + (Math.random() - 0.5) * 4,
        color: colors[Math.floor(Math.random() * 5)], // Main colors
        size: 8 + Math.random() * 12, // Large: 8-20px
        angle,
        speed: 80 + Math.random() * 100,
        rise: 60 + Math.random() * 80, // Slow vertical rise
        delay: burstDelay + Math.random() * 0.15,
        type: 'primary',
      });
    }

    // Secondary particles - medium, follow the primary
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * 360;
      particles.push({
        id: particleId++,
        x: burstX + (Math.random() - 0.5) * 6,
        y: burstY + (Math.random() - 0.5) * 6,
        color: colors[Math.floor(Math.random() * 7)],
        size: 5 + Math.random() * 8, // Medium: 5-13px
        angle,
        speed: 60 + Math.random() * 80,
        rise: 40 + Math.random() * 60,
        delay: burstDelay + 0.1 + Math.random() * 0.2,
        type: 'secondary',
      });
    }

    // Trail particles - create depth and movement
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * 360;
      particles.push({
        id: particleId++,
        x: burstX + (Math.random() - 0.5) * 8,
        y: burstY + (Math.random() - 0.5) * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 6, // Small-medium: 3-9px
        angle,
        speed: 40 + Math.random() * 70,
        rise: 50 + Math.random() * 70,
        delay: burstDelay + 0.2 + Math.random() * 0.3,
        type: 'trail',
      });
    }

    // Sparkle particles - tiny, twinkling, magical
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * 360;
      particles.push({
        id: particleId++,
        x: burstX + (Math.random() - 0.5) * 12,
        y: burstY + (Math.random() - 0.5) * 10,
        color: colors[colors.length - 2 + Math.floor(Math.random() * 2)], // White/light colors
        size: 2 + Math.random() * 4, // Tiny: 2-6px
        angle,
        speed: 30 + Math.random() * 50,
        rise: 30 + Math.random() * 50,
        delay: burstDelay + Math.random() * 0.5,
        type: 'sparkle',
      });
    }
  }

  return particles;
}

export function Fireworks({ isActive, winner }: FireworksProps): React.JSX.Element | null {
  // Generate particles when fireworks become active
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
          className={`firework-particle firework-${particle.type}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.size * 0.5}px ${particle.color}`,
            '--angle': `${particle.angle}deg`,
            '--speed': `${particle.speed}px`,
            '--rise': `${particle.rise}px`,
            animationDelay: `${particle.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
