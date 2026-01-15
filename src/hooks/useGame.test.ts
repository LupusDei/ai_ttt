import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGame } from './useGame';

describe('useGame', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

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
          mode: 'hvh',
          humanPlayer: 'X',
          difficulty: 'fun',
        });
      });

      expect(result.current.state.phase).toBe('playing');
      expect(result.current.isPlaying).toBe(true);
    });

    it('sets game configuration', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame({
          mode: 'hvc',
          humanPlayer: 'O',
          difficulty: 'god',
        });
      });

      expect(result.current.state.mode).toBe('hvc');
      expect(result.current.state.humanPlayer).toBe('O');
      expect(result.current.state.difficulty).toBe('god');
    });

    it('resets board when starting new game', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame({
          mode: 'hvh',
          humanPlayer: 'X',
          difficulty: 'fun',
        });
        result.current.makeMove({ row: 0, col: 0 });
      });

      act(() => {
        result.current.startGame({
          mode: 'hvh',
          humanPlayer: 'X',
          difficulty: 'fun',
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
          mode: 'hvh',
          humanPlayer: 'X',
          difficulty: 'fun',
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
          mode: 'hvh',
          humanPlayer: 'X',
          difficulty: 'fun',
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
          mode: 'hvh',
          humanPlayer: 'X',
          difficulty: 'fun',
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
          mode: 'hvh',
          humanPlayer: 'X',
          difficulty: 'fun',
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
          mode: 'hvh',
          humanPlayer: 'X',
          difficulty: 'fun',
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
          mode: 'hvh',
          humanPlayer: 'X',
          difficulty: 'fun',
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
    it('isHumanTurn is true when human should play in HvC mode', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame({
          mode: 'hvc',
          humanPlayer: 'X',
          difficulty: 'fun',
        });
      });

      expect(result.current.isHumanTurn).toBe(true);
      expect(result.current.isAITurn).toBe(false);
    });

    it('isAITurn is true when AI should play in HvC mode', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame({
          mode: 'hvc',
          humanPlayer: 'X',
          difficulty: 'fun',
        });
        result.current.makeMove({ row: 0, col: 0 });
      });

      expect(result.current.isHumanTurn).toBe(false);
      expect(result.current.isAITurn).toBe(true);
    });

    it('isHumanTurn and isAITurn are false in HvH mode', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame({
          mode: 'hvh',
          humanPlayer: 'X',
          difficulty: 'fun',
        });
      });

      expect(result.current.isHumanTurn).toBe(false);
      expect(result.current.isAITurn).toBe(false);
    });
  });

  describe('AI integration', () => {
    it('AI makes move automatically after human move in HvC mode', () => {
      const { result } = renderHook(() => useGame(100)); // 100ms delay for faster tests

      act(() => {
        result.current.startGame({
          mode: 'hvc',
          humanPlayer: 'X',
          difficulty: 'fun',
        });
      });

      // Human makes first move
      act(() => {
        result.current.makeMove({ row: 1, col: 1 }); // X plays center
      });

      expect(result.current.state.board[1][1]).toBe('X');
      expect(result.current.isAITurn).toBe(true);

      // Wait for AI move
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // AI should have made a move
      const filledCells = result.current.state.board.flat().filter((c) => c !== null);
      expect(filledCells.length).toBe(2);
      expect(result.current.state.currentPlayer).toBe('X'); // Back to human's turn
    });

    it('AI plays first when human is O in HvC mode', () => {
      const { result } = renderHook(() => useGame(100));

      act(() => {
        result.current.startGame({
          mode: 'hvc',
          humanPlayer: 'O',
          difficulty: 'fun',
        });
      });

      // X (AI) should play first
      expect(result.current.isAITurn).toBe(true);

      act(() => {
        vi.advanceTimersByTime(100);
      });

      // AI should have made a move
      const filledCells = result.current.state.board.flat().filter((c) => c !== null);
      expect(filledCells.length).toBe(1);
      expect(result.current.state.currentPlayer).toBe('O'); // Human's turn
      expect(result.current.isHumanTurn).toBe(true);
    });

    it('clears pending AI move on reset', () => {
      const { result } = renderHook(() => useGame(100));

      act(() => {
        result.current.startGame({
          mode: 'hvc',
          humanPlayer: 'X',
          difficulty: 'fun',
        });
        result.current.makeMove({ row: 1, col: 1 }); // Trigger AI turn
      });

      expect(result.current.isAITurn).toBe(true);

      // Reset before AI can move
      act(() => {
        result.current.resetGame();
      });

      // Advance timers - AI move should be cancelled
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Should be back to setup state with empty board
      expect(result.current.state.phase).toBe('setup');
      expect(result.current.state.board.flat().every((c) => c === null)).toBe(true);
    });
  });

  describe('CvC mode', () => {
    it('isCvC is true in CvC mode', () => {
      const { result } = renderHook(() => useGame(100));

      act(() => {
        result.current.startGame({
          mode: 'cvc',
          humanPlayer: 'X',
          difficulty: 'fun',
        });
      });

      expect(result.current.isCvC).toBe(true);
    });

    it('isCvC is false in HvH mode', () => {
      const { result } = renderHook(() => useGame(100));

      act(() => {
        result.current.startGame({
          mode: 'hvh',
          humanPlayer: 'X',
          difficulty: 'fun',
        });
      });

      expect(result.current.isCvC).toBe(false);
    });

    it('isAITurn is true for both players in CvC mode', () => {
      const { result } = renderHook(() => useGame(100));

      act(() => {
        result.current.startGame({
          mode: 'cvc',
          humanPlayer: 'X',
          difficulty: 'fun',
        });
      });

      // X starts, should be AI turn
      expect(result.current.isAITurn).toBe(true);
      expect(result.current.state.currentPlayer).toBe('X');

      // Let AI make move
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // O's turn, should also be AI turn
      expect(result.current.isAITurn).toBe(true);
      expect(result.current.state.currentPlayer).toBe('O');
    });

    it('AI plays automatically in CvC mode', () => {
      const { result } = renderHook(() => useGame(100));

      act(() => {
        result.current.startGame({
          mode: 'cvc',
          humanPlayer: 'X',
          difficulty: 'fun',
        });
      });

      // Wait for first AI move
      act(() => {
        vi.advanceTimersByTime(100);
      });

      const filledAfterFirst = result.current.state.board.flat().filter((c) => c !== null).length;
      expect(filledAfterFirst).toBe(1);

      // Wait for second AI move
      act(() => {
        vi.advanceTimersByTime(100);
      });

      const filledAfterSecond = result.current.state.board.flat().filter((c) => c !== null).length;
      expect(filledAfterSecond).toBe(2);
    });

    it('isPaused starts as false', () => {
      const { result } = renderHook(() => useGame(100));

      act(() => {
        result.current.startGame({
          mode: 'cvc',
          humanPlayer: 'X',
          difficulty: 'fun',
        });
      });

      expect(result.current.isPaused).toBe(false);
    });

    it('togglePause toggles the paused state', () => {
      const { result } = renderHook(() => useGame(100));

      act(() => {
        result.current.startGame({
          mode: 'cvc',
          humanPlayer: 'X',
          difficulty: 'fun',
        });
      });

      expect(result.current.isPaused).toBe(false);

      act(() => {
        result.current.togglePause();
      });

      expect(result.current.isPaused).toBe(true);

      act(() => {
        result.current.togglePause();
      });

      expect(result.current.isPaused).toBe(false);
    });

    it('pauses AI moves when isPaused is true in CvC mode', () => {
      const { result } = renderHook(() => useGame(100));

      act(() => {
        result.current.startGame({
          mode: 'cvc',
          humanPlayer: 'X',
          difficulty: 'fun',
        });
      });

      // Pause immediately
      act(() => {
        result.current.togglePause();
      });

      expect(result.current.isPaused).toBe(true);

      // Advance timers - should not make any moves
      act(() => {
        vi.advanceTimersByTime(200);
      });

      const filledCells = result.current.state.board.flat().filter((c) => c !== null).length;
      expect(filledCells).toBe(0);
    });

    it('resumes AI moves when unpaused in CvC mode', () => {
      const { result } = renderHook(() => useGame(100));

      act(() => {
        result.current.startGame({
          mode: 'cvc',
          humanPlayer: 'X',
          difficulty: 'fun',
        });
      });

      // Pause immediately
      act(() => {
        result.current.togglePause();
      });

      // Advance timers - should not make any moves
      act(() => {
        vi.advanceTimersByTime(200);
      });

      const filledWhilePaused = result.current.state.board.flat().filter((c) => c !== null).length;
      expect(filledWhilePaused).toBe(0);

      // Resume
      act(() => {
        result.current.togglePause();
      });

      // Wait for AI move
      act(() => {
        vi.advanceTimersByTime(100);
      });

      const filledAfterResume = result.current.state.board.flat().filter((c) => c !== null).length;
      expect(filledAfterResume).toBe(1);
    });

    it('startGame resets pause state', () => {
      const { result } = renderHook(() => useGame(100));

      act(() => {
        result.current.startGame({
          mode: 'cvc',
          humanPlayer: 'X',
          difficulty: 'fun',
        });
        result.current.togglePause();
      });

      expect(result.current.isPaused).toBe(true);

      act(() => {
        result.current.startGame({
          mode: 'cvc',
          humanPlayer: 'X',
          difficulty: 'fun',
        });
      });

      expect(result.current.isPaused).toBe(false);
    });

    it('resetGame resets pause state', () => {
      const { result } = renderHook(() => useGame(100));

      act(() => {
        result.current.startGame({
          mode: 'cvc',
          humanPlayer: 'X',
          difficulty: 'fun',
        });
        result.current.togglePause();
      });

      expect(result.current.isPaused).toBe(true);

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.isPaused).toBe(false);
    });
  });
});
