import type React from 'react';
import { useMemo } from 'react';
import './AnimatedBackground.css';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  colorDim: string;
  opacity: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
}

const PARTICLE_COUNT = 30;

const COLORS = {
  dark: [
    { color: 'rgba(139, 92, 246, 0.6)', dim: 'rgba(139, 92, 246, 0.2)' }, // Violet
    { color: 'rgba(99, 102, 241, 0.6)', dim: 'rgba(99, 102, 241, 0.2)' }, // Indigo
    { color: 'rgba(79, 70, 229, 0.6)', dim: 'rgba(79, 70, 229, 0.2)' }, // Indigo darker
    { color: 'rgba(124, 58, 237, 0.6)', dim: 'rgba(124, 58, 237, 0.2)' }, // Purple
    { color: 'rgba(167, 139, 250, 0.5)', dim: 'rgba(167, 139, 250, 0.15)' }, // Light violet
  ],
};

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const colorSet = COLORS.dark[Math.floor(Math.random() * COLORS.dark.length)];
    const size = 4 + Math.random() * 12;

    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size,
      color: colorSet.color,
      colorDim: colorSet.dim,
      opacity: 0.3 + Math.random() * 0.4,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 15,
      driftX: (Math.random() - 0.5) * 200,
      driftY: (Math.random() - 0.5) * 200,
    };
  });
}

export function AnimatedBackground(): React.JSX.Element {
  const particles = useMemo(() => generateParticles(), []);

  return (
    <div className="animated-background" aria-hidden="true" data-testid="animated-background">
      <div className="animated-gradient" data-testid="animated-gradient" />
      <div className="animated-gradient-overlay" data-testid="gradient-overlay" />
      <div className="particles-container" data-testid="particles-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle particle-glow"
            data-testid="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              '--color': particle.color,
              '--color-dim': particle.colorDim,
              '--size': `${particle.size}px`,
              '--opacity': particle.opacity,
              '--duration': `${particle.duration}s`,
              '--delay': `${particle.delay}s`,
              '--drift-x': `${particle.driftX}px`,
              '--drift-y': `${particle.driftY}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
