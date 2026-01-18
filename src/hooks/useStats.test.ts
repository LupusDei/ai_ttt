import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStats } from './useStats';

const STORAGE_KEY = 'ai_ttt_stats';

describe('useStats', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('starts with zero stats when localStorage is empty', () => {
      const { result } = renderHook(() => useStats());

      expect(result.current.stats).toEqual({
        wins: 0,
        losses: 0,
        draws: 0,
      });
    });

    it('loads existing stats from localStorage', () => {
      const savedStats = { wins: 5, losses: 3, draws: 2 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedStats));

      const { result } = renderHook(() => useStats());

      expect(result.current.stats).toEqual(savedStats);
    });

    it('returns default stats when localStorage contains invalid data', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json');

      const { result } = renderHook(() => useStats());

      expect(result.current.stats).toEqual({
        wins: 0,
        losses: 0,
        draws: 0,
      });
    });

    it('returns default stats when localStorage contains incomplete data', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ wins: 5 }));

      const { result } = renderHook(() => useStats());

      expect(result.current.stats).toEqual({
        wins: 0,
        losses: 0,
        draws: 0,
      });
    });
  });

  describe('recordResult', () => {
    it('increments wins when human player wins', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordResult(
          { winner: 'X', winningLine: null, isDraw: false },
          'X'
        );
      });

      expect(result.current.stats.wins).toBe(1);
      expect(result.current.stats.losses).toBe(0);
      expect(result.current.stats.draws).toBe(0);
    });

    it('increments losses when AI wins', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordResult(
          { winner: 'O', winningLine: null, isDraw: false },
          'X'
        );
      });

      expect(result.current.stats.wins).toBe(0);
      expect(result.current.stats.losses).toBe(1);
      expect(result.current.stats.draws).toBe(0);
    });

    it('increments draws when game is a draw', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordResult(
          { winner: null, winningLine: null, isDraw: true },
          'X'
        );
      });

      expect(result.current.stats.wins).toBe(0);
      expect(result.current.stats.losses).toBe(0);
      expect(result.current.stats.draws).toBe(1);
    });

    it('persists stats to localStorage', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordResult(
          { winner: 'X', winningLine: null, isDraw: false },
          'X'
        );
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as { wins: number; losses: number; draws: number };
      expect(stored).toEqual({ wins: 1, losses: 0, draws: 0 });
    });

    it('accumulates multiple results', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordResult(
          { winner: 'X', winningLine: null, isDraw: false },
          'X'
        );
      });

      act(() => {
        result.current.recordResult(
          { winner: 'O', winningLine: null, isDraw: false },
          'X'
        );
      });

      act(() => {
        result.current.recordResult(
          { winner: null, winningLine: null, isDraw: true },
          'X'
        );
      });

      expect(result.current.stats).toEqual({
        wins: 1,
        losses: 1,
        draws: 1,
      });
    });
  });

  describe('resetStats', () => {
    it('resets all stats to zero', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ wins: 5, losses: 3, draws: 2 }));
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.resetStats();
      });

      expect(result.current.stats).toEqual({
        wins: 0,
        losses: 0,
        draws: 0,
      });
    });

    it('persists reset to localStorage', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ wins: 5, losses: 3, draws: 2 }));
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.resetStats();
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as { wins: number; losses: number; draws: number };
      expect(stored).toEqual({ wins: 0, losses: 0, draws: 0 });
    });
  });
});
