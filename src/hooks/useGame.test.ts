import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useGame } from './useGame';

describe('useGame', () => {
  describe('initial state', () => {
    it('starts with setup phase', () => {
      const { result } = renderHook(() => useGame());
      expect(result.current.state.phase).toBe('setup');
    });

    it('starts with empty board', () => {
      const { result } = renderHook(() => useGame());
      const { board } = result.current.state;
      expect(board.flat().every((cell) => cell === null)).toBe(true);
    });

    it('starts with X as current player', () => {
      const { result } = renderHook(() => useGame());
      expect(result.current.state.currentPlayer).toBe('X');
    });

    it('isPlaying is false initially', () => {
      const { result } = renderHook(() => useGame());
      expect(result.current.isPlaying).toBe(false);
    });

    it('isFinished is false initially', () => {
      const { result } = renderHook(() => useGame());
      expect(result.current.isFinished).toBe(false);
    });
  });

  describe('startGame', () => {
    it('transitions to playing phase', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame({
          mode: 'pvp',
          humanPlayer: 'X',
          difficulty: 'medium',
        });
      });

      expect(result.current.state.phase).toBe('playing');
      expect(result.current.isPlaying).toBe(true);
    });

    it('sets game configuration', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame({
          mode: 'pve',
          humanPlayer: 'O',
          difficulty: 'hard',
        });
      });

      expect(result.current.state.mode).toBe('pve');
      expect(result.current.state.humanPlayer).toBe('O');
      expect(result.current.state.difficulty).toBe('hard');
    });

    it('resets board when starting new game', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame({
          mode: 'pvp',
          humanPlayer: 'X',
          difficulty: 'medium',
        });
        result.current.makeMove({ row: 0, col: 0 });
      });

      act(() => {
        result.current.startGame({
          mode: 'pvp',
          humanPlayer: 'X',
          difficulty: 'medium',
        });
      });

      const { board } = result.current.state;
      expect(board.flat().every((cell) => cell === null)).toBe(true);
    });
  });

  describe('makeMove', () => {
    it('places current player mark on board', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame({
          mode: 'pvp',
          humanPlayer: 'X',
          difficulty: 'medium',
        });
      });

      act(() => {
        result.current.makeMove({ row: 0, col: 0 });
      });

      expect(result.current.state.board[0][0]).toBe('X');
    });

    it('switches current player after move', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame({
          mode: 'pvp',
          humanPlayer: 'X',
          difficulty: 'medium',
        });
      });

      expect(result.current.state.currentPlayer).toBe('X');

      act(() => {
        result.current.makeMove({ row: 0, col: 0 });
      });

      expect(result.current.state.currentPlayer).toBe('O');
    });

    it('does not allow move on occupied cell', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame({
          mode: 'pvp',
          humanPlayer: 'X',
          difficulty: 'medium',
        });
        result.current.makeMove({ row: 0, col: 0 });
      });

      const playerBefore = result.current.state.currentPlayer;

      act(() => {
        result.current.makeMove({ row: 0, col: 0 });
      });

      expect(result.current.state.board[0][0]).toBe('X');
      expect(result.current.state.currentPlayer).toBe(playerBefore);
    });

    it('does not allow move when game is not playing', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.makeMove({ row: 0, col: 0 });
      });

      expect(result.current.state.board[0][0]).toBe(null);
    });

    it('detects winner and transitions to finished', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame({
          mode: 'pvp',
          humanPlayer: 'X',
          difficulty: 'medium',
        });
      });

      // X wins with top row
      act(() => {
        result.current.makeMove({ row: 0, col: 0 }); // X
      });
      act(() => {
        result.current.makeMove({ row: 1, col: 0 }); // O
      });
      act(() => {
        result.current.makeMove({ row: 0, col: 1 }); // X
      });
      act(() => {
        result.current.makeMove({ row: 1, col: 1 }); // O
      });
      act(() => {
        result.current.makeMove({ row: 0, col: 2 }); // X wins
      });

      expect(result.current.state.phase).toBe('finished');
      expect(result.current.isFinished).toBe(true);
      expect(result.current.state.result?.winner).toBe('X');
      expect(result.current.state.result?.winningLine).toEqual([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ]);
    });

    it('detects draw', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame({
          mode: 'pvp',
          humanPlayer: 'X',
          difficulty: 'medium',
        });
      });

      // Play a draw game
      const moves = [
        { row: 0, col: 0 }, // X
        { row: 0, col: 1 }, // O
        { row: 0, col: 2 }, // X
        { row: 1, col: 1 }, // O
        { row: 1, col: 0 }, // X
        { row: 1, col: 2 }, // O
        { row: 2, col: 1 }, // X
        { row: 2, col: 0 }, // O
        { row: 2, col: 2 }, // X - draw
      ];

      moves.forEach((move) => {
        act(() => {
          result.current.makeMove(move);
        });
      });

      expect(result.current.state.phase).toBe('finished');
      expect(result.current.state.result?.winner).toBe(null);
      expect(result.current.state.result?.isDraw).toBe(true);
    });
  });

  describe('resetGame', () => {
    it('returns to initial state', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame({
          mode: 'pvp',
          humanPlayer: 'X',
          difficulty: 'medium',
        });
        result.current.makeMove({ row: 0, col: 0 });
      });

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.state.phase).toBe('setup');
      expect(result.current.state.board.flat().every((cell) => cell === null)).toBe(true);
      expect(result.current.state.currentPlayer).toBe('X');
    });
  });

  describe('computed values', () => {
    it('isHumanTurn is true when human should play in PvE', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame({
          mode: 'pve',
          humanPlayer: 'X',
          difficulty: 'medium',
        });
      });

      expect(result.current.isHumanTurn).toBe(true);
      expect(result.current.isAITurn).toBe(false);
    });

    it('isAITurn is true when AI should play in PvE', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame({
          mode: 'pve',
          humanPlayer: 'X',
          difficulty: 'medium',
        });
        result.current.makeMove({ row: 0, col: 0 });
      });

      expect(result.current.isHumanTurn).toBe(false);
      expect(result.current.isAITurn).toBe(true);
    });

    it('isHumanTurn and isAITurn are false in PvP mode', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame({
          mode: 'pvp',
          humanPlayer: 'X',
          difficulty: 'medium',
        });
      });

      expect(result.current.isHumanTurn).toBe(false);
      expect(result.current.isAITurn).toBe(false);
    });
  });
});
