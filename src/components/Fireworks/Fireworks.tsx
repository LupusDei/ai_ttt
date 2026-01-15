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

  // Create multiple bursts centered around the "Player X Wins!" text area
  const numBursts = 6;
  const particlesPerBurst = 35;

  for (let burst = 0; burst < numBursts; burst++) {
    // Position bursts around the center-top area where the status text is
    // Spread horizontally between 25-75% and vertically around 35-50%
    const burstX = 30 + Math.random() * 40; // Random X position (30-70%)
    const burstY = 35 + Math.random() * 15; // Random Y position (35-50%)
    const burstDelay = burst * 0.4; // Stagger bursts

    // Each burst has multiple particles
    for (let i = 0; i < particlesPerBurst; i++) {
      particles.push({
        id: burst * particlesPerBurst + i,
        x: burstX + (Math.random() - 0.5) * 10, // Small spread around burst center
        y: burstY + (Math.random() - 0.5) * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 5 + Math.random() * 10,
        angle: Math.random() * 360,
        speed: 60 + Math.random() * 120,
        delay: burstDelay + Math.random() * 0.3,
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
