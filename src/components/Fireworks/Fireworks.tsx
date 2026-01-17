import type React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import './Fireworks.css';

interface FireworkRocket {
  id: number;
  x: number; // horizontal position (%)
  launchTime: number; // when it launches (ms from start)
  color: string;
  burstColors: string[];
}

interface ActiveRocket {
  rocket: FireworkRocket;
  progress: number; // 0 to 1
}

interface BurstParticle {
  id: number;
  rocketId: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  color: string;
}

interface FireworksProps {
  isActive: boolean;
  winner: 'X' | 'O' | null;
}

const COLORS = {
  X: {
    rocket: '#60a5fa',
    burst: ['#60a5fa', '#3b82f6', '#93c5fd', '#bfdbfe', '#ffffff', '#818cf8'],
  },
  O: {
    rocket: '#f87171',
    burst: ['#f87171', '#ef4444', '#fca5a5', '#fecaca', '#ffffff', '#fb923c'],
  },
};

const ROCKET_COUNT = 5;
const LAUNCH_INTERVAL = 500; // ms between launches
const FLIGHT_DURATION = 2000; // ms to reach burst point
const BURST_Y = 35; // % from top where burst happens

function generateRockets(winner: 'X' | 'O'): FireworkRocket[] {
  const colors = COLORS[winner];
  return Array.from({ length: ROCKET_COUNT }, (_, i) => ({
    id: i,
    x: 20 + Math.random() * 60, // Random X between 20-80%
    launchTime: i * LAUNCH_INTERVAL,
    color: colors.rocket,
    burstColors: colors.burst,
  }));
}

function generateBurstParticles(rocket: FireworkRocket, burstId: number): BurstParticle[] {
  const particles: BurstParticle[] = [];
  const particleCount = 40;

  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * 360 + Math.random() * 20;
    particles.push({
      id: burstId * 100 + i,
      rocketId: rocket.id,
      x: rocket.x,
      y: BURST_Y,
      angle,
      speed: 40 + Math.random() * 80,
      size: 4 + Math.random() * 8,
      color: rocket.burstColors[Math.floor(Math.random() * rocket.burstColors.length)],
    });
  }

  return particles;
}

function FireworksInner({ winner }: { winner: 'X' | 'O' }): React.JSX.Element {
  const [activeRockets, setActiveRockets] = useState<ActiveRocket[]>([]);
  const [bursts, setBursts] = useState<BurstParticle[]>([]);

  const rockets = useMemo(() => generateRockets(winner), [winner]);
  const startTimeRef = useRef<number>(0);
  const burstTriggeredRef = useRef<Set<number>>(new Set());

  // Handle rocket launches and bursts with animation frame
  useEffect(() => {
    let animationId: number;
    let mounted = true;

    startTimeRef.current = performance.now();
    burstTriggeredRef.current = new Set();

    const animate = (): void => {
      if (!mounted) return;

      const startTime = startTimeRef.current;
      const elapsed = performance.now() - startTime;

      // Update active rockets with their progress
      const newActiveRockets: ActiveRocket[] = [];
      const newBursts: BurstParticle[] = [];

      rockets.forEach((rocket) => {
        const rocketElapsed = elapsed - rocket.launchTime;

        // Rocket is in flight
        if (rocketElapsed >= 0 && rocketElapsed < FLIGHT_DURATION) {
          const progress = rocketElapsed / FLIGHT_DURATION;
          newActiveRockets.push({ rocket, progress });
        }

        // Rocket just reached burst point
        if (rocketElapsed >= FLIGHT_DURATION && !burstTriggeredRef.current.has(rocket.id)) {
          burstTriggeredRef.current.add(rocket.id);
          newBursts.push(...generateBurstParticles(rocket, rocket.id));
        }
      });

      setActiveRockets(newActiveRockets);
      if (newBursts.length > 0) {
        setBursts((prev) => [...prev, ...newBursts]);
      }

      // Continue animation until all fireworks are done
      const totalDuration = (ROCKET_COUNT - 1) * LAUNCH_INTERVAL + FLIGHT_DURATION + 3000;
      if (elapsed < totalDuration) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return (): void => {
      mounted = false;
      cancelAnimationFrame(animationId);
    };
  }, [rockets]);

  return (
    <div className="fireworks-container" aria-hidden="true">
      {/* Rockets in flight */}
      {activeRockets.map(({ rocket, progress }) => {
        const currentY = 95 - progress * (95 - BURST_Y); // From 95% to BURST_Y%

        return (
          <div key={`rocket-${rocket.id}`} className="firework-rocket-container">
            {/* Rocket head */}
            <div
              className="firework-rocket"
              style={{
                left: `${rocket.x}%`,
                top: `${currentY}%`,
                backgroundColor: rocket.color,
                boxShadow: `0 0 10px 3px ${rocket.color}`,
              }}
            />
            {/* Spark trail */}
            {Array.from({ length: 8 }, (_, i) => {
              const trailY = currentY + (i + 1) * 2;
              const opacity = 1 - i / 8;
              const size = 6 - i * 0.5;
              return (
                <div
                  key={`trail-${rocket.id}-${i}`}
                  className="firework-trail-spark"
                  style={{
                    left: `${rocket.x + (Math.random() - 0.5) * 2}%`,
                    top: `${trailY}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    opacity,
                    backgroundColor: rocket.color,
                    boxShadow: `0 0 ${size}px ${size / 2}px ${rocket.color}`,
                  }}
                />
              );
            })}
          </div>
        );
      })}

      {/* Burst particles */}
      {bursts.map((particle) => (
        <div
          key={`burst-${particle.id}`}
          className="firework-burst-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.size / 2}px ${particle.color}`,
            '--angle': `${particle.angle}deg`,
            '--speed': `${particle.speed}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function useFireworksKey(isActive: boolean): number {
  const [key, setKey] = useState(0);
  const [prevActive, setPrevActive] = useState(isActive);

  // React-approved pattern: adjust state during render based on prop changes
  // This is not an effect, so it doesn't trigger the linter warning
  if (isActive !== prevActive) {
    setPrevActive(isActive);
    if (isActive) {
      setKey((k) => k + 1);
    }
  }

  return key;
}

export function Fireworks({ isActive, winner }: FireworksProps): React.JSX.Element | null {
  const key = useFireworksKey(isActive);

  if (!isActive || winner === null) {
    return null;
  }

  return <FireworksInner key={key} winner={winner} />;
}
