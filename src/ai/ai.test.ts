import { describe, it, expect } from 'vitest';
import { funStrategy } from './fun.ts';
import { godStrategy } from './god.ts';
import { getStrategy } from './index.ts';
import type { BoardGrid, Player } from '../core/types.ts';
import { createBoard, setCell, getEmptyCells, checkWinner, isDraw } from '../core/board.ts';

/**
 * Simulates a game between two strategies
 * Returns the winner or null for a draw
 */
function simulateGame(
  xStrategy: (board: BoardGrid, player: Player) => { row: number; col: number },
  oStrategy: (board: BoardGrid, player: Player) => { row: number; col: number }
): Player | null {
  let board = createBoard();
  let currentPlayer: Player = 'X';

  // Maximum 9 moves in tic-tac-toe
  for (let turn = 0; turn < 9; turn++) {
    const strategy = currentPlayer === 'X' ? xStrategy : oStrategy;
    const move = strategy(board, currentPlayer);
    board = setCell(board, move, currentPlayer);

    const winner = checkWinner(board);
    if (winner) {
      return winner;
    }

    if (isDraw(board)) {
      return null;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }

  return null; // Draw (should not reach here normally)
}

/** Random move strategy for testing */
function randomMove(board: BoardGrid): { row: number; col: number } {
  const emptyCells = getEmptyCells(board);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

describe('funStrategy', () => {
  it('returns a valid move on empty board', () => {
    const board = createBoard();
    const move = funStrategy.getMove(board, 'X');

    expect(move.row).toBeGreaterThanOrEqual(0);
    expect(move.row).toBeLessThanOrEqual(2);
    expect(move.col).toBeGreaterThanOrEqual(0);
    expect(move.col).toBeLessThanOrEqual(2);
  });

  it('returns a valid move on partially filled board', () => {
    const board: BoardGrid = [
      ['X', 'O', null],
      [null, 'X', null],
      ['O', null, null],
    ];
    const move = funStrategy.getMove(board, 'X');
    const emptyCells = getEmptyCells(board);

    expect(emptyCells).toContainEqual(move);
  });

  it('takes winning move when available', () => {
    const board: BoardGrid = [
      ['X', 'X', null],
      ['O', 'O', null],
      [null, null, null],
    ];
    const move = funStrategy.getMove(board, 'X');

    // Should take the winning move at (0, 2)
    expect(move).toEqual({ row: 0, col: 2 });
  });

  it('blocks opponent winning move', () => {
    const board: BoardGrid = [
      ['O', 'O', null],
      ['X', null, null],
      [null, null, 'X'],
    ];
    const move = funStrategy.getMove(board, 'X');

    // Should block at (0, 2)
    expect(move).toEqual({ row: 0, col: 2 });
  });

  it('has correct name and difficulty', () => {
    expect(funStrategy.name).toBe('Fun AI');
    expect(funStrategy.difficulty).toBe('fun');
  });
});

describe('godStrategy', () => {
  it('returns a valid move on empty board', () => {
    const board = createBoard();
    const move = godStrategy.getMove(board, 'X');

    expect(move.row).toBeGreaterThanOrEqual(0);
    expect(move.row).toBeLessThanOrEqual(2);
    expect(move.col).toBeGreaterThanOrEqual(0);
    expect(move.col).toBeLessThanOrEqual(2);
  });

  it('takes center on empty board', () => {
    const board = createBoard();
    const move = godStrategy.getMove(board, 'X');

    expect(move).toEqual({ row: 1, col: 1 });
  });

  it('returns a valid move on partially filled board', () => {
    const board: BoardGrid = [
      ['X', 'O', null],
      [null, 'X', null],
      ['O', null, null],
    ];
    const move = godStrategy.getMove(board, 'O');
    const emptyCells = getEmptyCells(board);

    expect(emptyCells).toContainEqual(move);
  });

  it('takes winning move when available', () => {
    const board: BoardGrid = [
      ['X', 'X', null],
      ['O', 'O', null],
      [null, null, null],
    ];
    const move = godStrategy.getMove(board, 'X');

    // Should take the winning move at (0, 2)
    expect(move).toEqual({ row: 0, col: 2 });
  });

  it('has correct name and difficulty', () => {
    expect(godStrategy.name).toBe('God AI');
    expect(godStrategy.difficulty).toBe('god');
  });

  it('never loses when playing as X (first player)', () => {
    // Simulate 10 games with God AI as X vs random moves
    for (let i = 0; i < 10; i++) {
      const result = simulateGame(
        (board, player) => godStrategy.getMove(board, player),
        (board) => randomMove(board)
      );

      // God AI should never lose - either win or draw
      expect(result).not.toBe('O');
    }
  });

  it('never loses when playing as O (second player)', () => {
    // Simulate 10 games with God AI as O vs random moves
    for (let i = 0; i < 10; i++) {
      const result = simulateGame(
        (board) => randomMove(board),
        (board, player) => godStrategy.getMove(board, player)
      );

      // God AI should never lose - either O wins or draw
      expect(result).not.toBe('X');
    }
  });

  it('always draws against itself', () => {
    // Two perfect players should always draw
    for (let i = 0; i < 5; i++) {
      const result = simulateGame(
        (board, player) => godStrategy.getMove(board, player),
        (board, player) => godStrategy.getMove(board, player)
      );

      expect(result).toBeNull(); // Draw
    }
  });
});

describe('getStrategy factory', () => {
  it('returns funStrategy for fun difficulty', () => {
    const strategy = getStrategy('fun');
    expect(strategy).toBe(funStrategy);
  });

  it('returns godStrategy for god difficulty', () => {
    const strategy = getStrategy('god');
    expect(strategy).toBe(godStrategy);
  });
});
