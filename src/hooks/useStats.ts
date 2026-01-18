import { useState, useCallback } from 'react';
import type { PlayerStats, GameResult, Player } from '../core/types';

const STORAGE_KEY = 'ai_ttt_stats';

const DEFAULT_STATS: PlayerStats = {
  wins: 0,
  losses: 0,
  draws: 0,
};

function loadStats(): PlayerStats {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null && stored !== '') {
      const parsed = JSON.parse(stored) as PlayerStats;
      if (
        typeof parsed.wins === 'number' &&
        typeof parsed.losses === 'number' &&
        typeof parsed.draws === 'number'
      ) {
        return parsed;
      }
    }
  } catch {
    // Invalid stored data, return defaults
  }
  return DEFAULT_STATS;
}

function saveStats(stats: PlayerStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Storage unavailable or full, silently fail
  }
}

export interface UseStatsReturn {
  stats: PlayerStats;
  recordResult: (result: GameResult, humanPlayer: Player) => void;
  resetStats: () => void;
}

export function useStats(): UseStatsReturn {
  const [stats, setStats] = useState<PlayerStats>(loadStats);

  const recordResult = useCallback((result: GameResult, humanPlayer: Player): void => {
    setStats((prev) => {
      let newStats: PlayerStats;

      if (result.isDraw) {
        newStats = { ...prev, draws: prev.draws + 1 };
      } else if (result.winner === humanPlayer) {
        newStats = { ...prev, wins: prev.wins + 1 };
      } else {
        newStats = { ...prev, losses: prev.losses + 1 };
      }

      saveStats(newStats);
      return newStats;
    });
  }, []);

  const resetStats = useCallback((): void => {
    setStats(DEFAULT_STATS);
    saveStats(DEFAULT_STATS);
  }, []);

  return {
    stats,
    recordResult,
    resetStats,
  };
}
