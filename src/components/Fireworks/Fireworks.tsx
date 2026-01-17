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
    burst: [
      '#60a5fa', '#3b82f6', '#2563eb', '#93c5fd', '#bfdbfe', // Blues
      '#818cf8', '#a5b4fc', '#c4b5fd', // Purples
      '#ffffff', '#f0f9ff', '#e0f2fe', // Whites/highlights
    ],
  },
  O: {
    rocket: '#f87171',
    burst: [
      '#f87171', '#ef4444', '#dc2626', '#fca5a5', '#fecaca', // Reds
      '#fb923c', '#fdba74', '#fcd34d', // Oranges/yellows
      '#ffffff', '#fef2f2', '#fff7ed', // Whites/highlights
    ],
  },
};

const ROCKET_COUNT = 10;
const LAUNCH_INTERVAL = 150; // ms between launches (faster)
const FLIGHT_DURATION = 1500; // ms to reach burst point (faster)
const BURST_Y = 30; // % from top where burst happens (higher)
const START_DELAY = 250; // ms delay after win before fireworks start

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
  const particleCount = 80; // More particles for bigger bursts

  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * 360 + Math.random() * 15;
    // Vary sizes: some large primary particles, many smaller trailing ones
    const isPrimary = i < particleCount / 3;
    particles.push({
      id: burstId * 100 + i,
      rocketId: rocket.id,
      x: rocket.x + (Math.random() - 0.5) * 2, // Slight spread
      y: BURST_Y + (Math.random() - 0.5) * 2,
      angle,
      speed: isPrimary ? 60 + Math.random() * 100 : 30 + Math.random() * 70,
      size: isPrimary ? 6 + Math.random() * 10 : 3 + Math.random() * 6,
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
            {/* Rocket head - brighter glow */}
            <div
              className="firework-rocket"
              style={{
                left: `${rocket.x}%`,
                top: `${currentY}%`,
                backgroundColor: rocket.color,
                boxShadow: `0 0 15px 5px ${rocket.color}, 0 0 30px 10px ${rocket.color}40`,
              }}
            />
            {/* Spark trail - more sparks, longer trail */}
            {Array.from({ length: 12 }, (_, i) => {
              const trailY = currentY + (i + 1) * 1.8;
              const opacity = 1 - i / 12;
              const size = 8 - i * 0.5;
              const xOffset = (Math.random() - 0.5) * 3;
              return (
                <div
                  key={`trail-${rocket.id}-${i}`}
                  className="firework-trail-spark"
                  style={{
                    left: `calc(${rocket.x}% + ${xOffset}px)`,
                    top: `${trailY}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    opacity,
                    backgroundColor: rocket.color,
                    boxShadow: `0 0 ${size * 1.5}px ${size / 2}px ${rocket.color}`,
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
            boxShadow: `0 0 ${particle.size * 2}px ${particle.size}px ${particle.color}, 0 0 ${particle.size * 4}px ${particle.size * 1.5}px ${particle.color}60`,
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
  const [showFireworks, setShowFireworks] = useState(false);

  // Delay showing fireworks after win is revealed
  useEffect(() => {
    if (!isActive || winner === null) {
      // Reset state asynchronously to avoid lint warning
      const resetTimer = setTimeout(() => {
        setShowFireworks(false);
      }, 0);
      return (): void => {
        clearTimeout(resetTimer);
      };
    }

    const timer = setTimeout(() => {
      setShowFireworks(true);
    }, START_DELAY);

    return (): void => {
      clearTimeout(timer);
    };
  }, [isActive, winner]);

  if (!isActive || winner === null || !showFireworks) {
    return null;
  }

  return <FireworksInner key={key} winner={winner} />;
}
