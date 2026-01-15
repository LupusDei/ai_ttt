import { describe, it, expect } from 'vitest';
import {
  createBoard,
  getCell,
  setCell,
  getEmptyCells,
  cloneBoard,
  checkWinner,
  getWinningLine,
  isBoardFull,
  isDraw,
} from './board.ts';
import type { Board } from './types.ts';

describe('createBoard', () => {
  it('creates a 3x3 empty board', () => {
    const board = createBoard();
    expect(board).toHaveLength(3);
    for (const row of board) {
      expect(row).toHaveLength(3);
      for (const cell of row) {
        expect(cell).toBeNull();
      }
    }
  });
});

describe('getCell', () => {
  it('returns the cell value at the given position', () => {
    const board: Board = [
      ['X', 'O', null],
      [null, 'X', null],
      ['O', null, 'X'],
    ];
    expect(getCell(board, { row: 0, col: 0 })).toBe('X');
    expect(getCell(board, { row: 0, col: 1 })).toBe('O');
    expect(getCell(board, { row: 0, col: 2 })).toBeNull();
    expect(getCell(board, { row: 1, col: 1 })).toBe('X');
    expect(getCell(board, { row: 2, col: 0 })).toBe('O');
  });
});

describe('setCell', () => {
  it('sets the cell value at the given position', () => {
    const board = createBoard();
    const newBoard = setCell(board, { row: 1, col: 1 }, 'X');
    expect(getCell(newBoard, { row: 1, col: 1 })).toBe('X');
  });

  it('returns a new board (immutable)', () => {
    const board = createBoard();
    const newBoard = setCell(board, { row: 0, col: 0 }, 'O');
    expect(newBoard).not.toBe(board);
    expect(getCell(board, { row: 0, col: 0 })).toBeNull();
    expect(getCell(newBoard, { row: 0, col: 0 })).toBe('O');
  });

  it('can set a cell to null', () => {
    const board: Board = [
      ['X', null, null],
      [null, null, null],
      [null, null, null],
    ];
    const newBoard = setCell(board, { row: 0, col: 0 }, null);
    expect(getCell(newBoard, { row: 0, col: 0 })).toBeNull();
  });
});

describe('getEmptyCells', () => {
  it('returns all empty positions on an empty board', () => {
    const board = createBoard();
    const emptyCells = getEmptyCells(board);
    expect(emptyCells).toHaveLength(9);
  });

  it('returns correct positions for a partially filled board', () => {
    const board: Board = [
      ['X', 'O', null],
      [null, 'X', null],
      ['O', null, 'X'],
    ];
    const emptyCells = getEmptyCells(board);
    expect(emptyCells).toHaveLength(4);
    expect(emptyCells).toContainEqual({ row: 0, col: 2 });
    expect(emptyCells).toContainEqual({ row: 1, col: 0 });
    expect(emptyCells).toContainEqual({ row: 1, col: 2 });
    expect(emptyCells).toContainEqual({ row: 2, col: 1 });
  });

  it('returns empty array for a full board', () => {
    const board: Board = [
      ['X', 'O', 'X'],
      ['O', 'X', 'O'],
      ['O', 'X', 'O'],
    ];
    const emptyCells = getEmptyCells(board);
    expect(emptyCells).toHaveLength(0);
  });
});

describe('cloneBoard', () => {
  it('creates a deep copy of the board', () => {
    const board: Board = [
      ['X', 'O', null],
      [null, 'X', null],
      ['O', null, 'X'],
    ];
    const cloned = cloneBoard(board);
    expect(cloned).toEqual(board);
    expect(cloned).not.toBe(board);
  });

  it('modifications to clone do not affect original', () => {
    const board: Board = [
      ['X', null, null],
      [null, null, null],
      [null, null, null],
    ];
    const cloned = cloneBoard(board);
    cloned[0][1] = 'O';
    expect(board[0][1]).toBeNull();
    expect(cloned[0][1]).toBe('O');
  });
});

describe('checkWinner', () => {
  it('returns null for empty board', () => {
    const board = createBoard();
    expect(checkWinner(board)).toBeNull();
  });

  it('returns null for board with no winner', () => {
    const board: Board = [
      ['X', 'O', 'X'],
      ['X', 'O', 'O'],
      ['O', 'X', 'X'],
    ];
    expect(checkWinner(board)).toBeNull();
  });

  // Row wins
  it('detects X winning on row 0', () => {
    const board: Board = [
      ['X', 'X', 'X'],
      ['O', 'O', null],
      [null, null, null],
    ];
    expect(checkWinner(board)).toBe('X');
  });

  it('detects O winning on row 1', () => {
    const board: Board = [
      ['X', 'X', null],
      ['O', 'O', 'O'],
      ['X', null, null],
    ];
    expect(checkWinner(board)).toBe('O');
  });

  it('detects X winning on row 2', () => {
    const board: Board = [
      ['O', 'O', null],
      [null, null, null],
      ['X', 'X', 'X'],
    ];
    expect(checkWinner(board)).toBe('X');
  });

  // Column wins
  it('detects X winning on column 0', () => {
    const board: Board = [
      ['X', 'O', null],
      ['X', 'O', null],
      ['X', null, null],
    ];
    expect(checkWinner(board)).toBe('X');
  });

  it('detects O winning on column 1', () => {
    const board: Board = [
      ['X', 'O', null],
      [null, 'O', 'X'],
      ['X', 'O', null],
    ];
    expect(checkWinner(board)).toBe('O');
  });

  it('detects X winning on column 2', () => {
    const board: Board = [
      ['O', 'O', 'X'],
      [null, null, 'X'],
      [null, null, 'X'],
    ];
    expect(checkWinner(board)).toBe('X');
  });

  // Diagonal wins
  it('detects X winning on main diagonal', () => {
    const board: Board = [
      ['X', 'O', null],
      ['O', 'X', null],
      [null, null, 'X'],
    ];
    expect(checkWinner(board)).toBe('X');
  });

  it('detects O winning on anti-diagonal', () => {
    const board: Board = [
      ['X', 'X', 'O'],
      [null, 'O', null],
      ['O', null, 'X'],
    ];
    expect(checkWinner(board)).toBe('O');
  });
});

describe('getWinningLine', () => {
  it('returns null for empty board', () => {
    const board = createBoard();
    expect(getWinningLine(board)).toBeNull();
  });

  it('returns null for board with no winner', () => {
    const board: Board = [
      ['X', 'O', 'X'],
      ['X', 'O', 'O'],
      ['O', 'X', 'X'],
    ];
    expect(getWinningLine(board)).toBeNull();
  });

  it('returns winning line positions for row win', () => {
    const board: Board = [
      ['X', 'X', 'X'],
      ['O', 'O', null],
      [null, null, null],
    ];
    const line = getWinningLine(board);
    expect(line).toHaveLength(3);
    expect(line).toContainEqual({ row: 0, col: 0 });
    expect(line).toContainEqual({ row: 0, col: 1 });
    expect(line).toContainEqual({ row: 0, col: 2 });
  });

  it('returns winning line positions for diagonal win', () => {
    const board: Board = [
      ['X', 'O', null],
      ['O', 'X', null],
      [null, null, 'X'],
    ];
    const line = getWinningLine(board);
    expect(line).toHaveLength(3);
    expect(line).toContainEqual({ row: 0, col: 0 });
    expect(line).toContainEqual({ row: 1, col: 1 });
    expect(line).toContainEqual({ row: 2, col: 2 });
  });
});

describe('isBoardFull', () => {
  it('returns false for empty board', () => {
    const board = createBoard();
    expect(isBoardFull(board)).toBe(false);
  });

  it('returns false for partially filled board', () => {
    const board: Board = [
      ['X', 'O', null],
      [null, 'X', null],
      ['O', null, 'X'],
    ];
    expect(isBoardFull(board)).toBe(false);
  });

  it('returns true for full board', () => {
    const board: Board = [
      ['X', 'O', 'X'],
      ['O', 'X', 'O'],
      ['O', 'X', 'O'],
    ];
    expect(isBoardFull(board)).toBe(true);
  });
});

describe('isDraw', () => {
  it('returns false for empty board', () => {
    const board = createBoard();
    expect(isDraw(board)).toBe(false);
  });

  it('returns false for board with winner', () => {
    const board: Board = [
      ['X', 'X', 'X'],
      ['O', 'O', null],
      [null, null, null],
    ];
    expect(isDraw(board)).toBe(false);
  });

  it('returns false for full board with winner', () => {
    const board: Board = [
      ['X', 'X', 'X'],
      ['O', 'O', 'X'],
      ['X', 'O', 'O'],
    ];
    expect(isDraw(board)).toBe(false);
  });

  it('returns true for full board with no winner (draw)', () => {
    const board: Board = [
      ['X', 'O', 'X'],
      ['X', 'O', 'O'],
      ['O', 'X', 'X'],
    ];
    expect(isDraw(board)).toBe(true);
  });

  it('returns false for partially filled board with no winner', () => {
    const board: Board = [
      ['X', 'O', null],
      [null, 'X', null],
      ['O', null, null],
    ];
    expect(isDraw(board)).toBe(false);
  });
});
